// Cliente HTTP del SPA (design D1/D4): fetch contra /api con el header Basic
// guardado en sessionStorage para operaciones de escritura. Las lecturas son
// públicas por defecto (AUTH_READS=false); si el backend responde 401 se lanza
// ApiError para que la UI ofrezca credenciales.

import type {
  MetaResponse,
  RegistrationPayload,
  Sample,
  SampleFilters,
  SampleListResponse,
} from "../types";

const AUTH_STORAGE_KEY = "geosamples.auth";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Header Basic almacenado ("Basic base64(user:pass)") o null. */
export function getAuthHeader(): string | null {
  return sessionStorage.getItem(AUTH_STORAGE_KEY);
}

export function setAuthHeader(username: string, password: string): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, `Basic ${btoa(`${username}:${password}`)}`);
}

export function clearAuthHeader(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function toQuery(filters: SampleFilters): string {
  const params = new URLSearchParams();
  const entries: [string, string | number | undefined][] = [
    ["code", filters.code],
    ["rock", filters.rock],
    ["unit", filters.unit],
    ["collector", filters.collector],
    ["analysis", filters.analysis],
    ["plancha", filters.plancha],
    ["dateFrom", filters.dateFrom],
    ["dateTo", filters.dateTo],
    ["q", filters.q],
    ["norteMin", filters.norteMin],
    ["norteMax", filters.norteMax],
    ["esteMin", filters.esteMin],
    ["esteMax", filters.esteMax],
    ["page", filters.page],
    ["pageSize", filters.pageSize],
  ];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== null && String(value) !== "") {
      params.set(key, String(value));
    }
  }
  const query = params.toString();
  return query === "" ? "" : `?${query}`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    let message = `La solicitud falló con el estado ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (typeof body.error === "string") message = body.error;
    } catch {
      // el cuerpo no es JSON; se conserva el mensaje genérico
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

function authHeaders(): HeadersInit {
  const header = getAuthHeader();
  return header === null ? {} : { Authorization: header };
}

/** GET /api/samples con filtros y paginación. */
export async function listSamples(filters: SampleFilters = {}): Promise<SampleListResponse> {
  return requestJson<SampleListResponse>(`/api/samples${toQuery(filters)}`, {
    headers: authHeaders(),
  });
}

/** GET /api/samples/:code → Sample; 404 lanza ApiError. */
export async function getSample(code: string): Promise<Sample> {
  return requestJson<Sample>(`/api/samples/${encodeURIComponent(code)}`, {
    headers: authHeaders(),
  });
}

/** GET /api/meta: catálogos canónicos y constantes del proyecto. */
export async function getMeta(): Promise<MetaResponse> {
  return requestJson<MetaResponse>("/api/meta");
}

/** POST /api/samples (requiere credenciales admin). */
export async function createSample(payload: RegistrationPayload): Promise<Sample> {
  return requestJson<Sample>("/api/samples", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
}

/**
 * GET /api/samples/export → CSV descargable con los filtros actuales.
 * El CSV se descarga como blob (sin BOM, UTF-8).
 */
export async function exportCsv(filters: SampleFilters = {}): Promise<void> {
  const res = await fetch(`/api/samples/export${toQuery(filters)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new ApiError(res.status, "No se pudo exportar");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "samples.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}