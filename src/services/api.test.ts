// Pruebas del servicio API: construcción de query string, header Basic desde
// sessionStorage, POST de registro y descarga CSV (blob).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  createSample,
  exportCsv,
  getAuthHeader,
  getMeta,
  listSamples,
  setAuthHeader,
} from "./api";
import type { SampleFilters } from "../types";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

describe("listSamples", () => {
  it("builds the query string from non-empty filters only", async () => {
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(jsonResponse({ data: [], total: 0, page: 1, pageSize: 25 })));
    const filters: SampleFilters = {
      code: "acm0398P",
      rock: "Granito",
      unit: "",
      page: 2,
      pageSize: 25,
    };
    await listSamples(filters);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/samples?code=acm0398P&rock=Granito&page=2&pageSize=25",
      expect.objectContaining({ headers: {} }),
    );
  });

  it("sends the stored Basic header when credentials exist", async () => {
    setAuthHeader("admin", "secret");
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(jsonResponse({ data: [], total: 0, page: 1, pageSize: 25 })));
    await listSamples({});
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toEqual({ Authorization: getAuthHeader() });
  });

  it("throws ApiError with the server message on failure", async () => {
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(jsonResponse({ error: "Sample not found" }, 404)));
    await expect(listSamples({})).rejects.toMatchObject({ status: 404, message: "Sample not found" });
  });
});

describe("getMeta", () => {
  it("fetches /api/meta", async () => {
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(jsonResponse({ rockTypes: [], collectors: [], analysisTypes: [], constants: {} })));
    await getMeta();
    expect(fetchMock).toHaveBeenCalledWith("/api/meta", undefined);
  });
});

describe("createSample", () => {
  it("posts the payload as JSON with the stored auth header", async () => {
    setAuthHeader("admin", "secret");
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(jsonResponse({ id: 1, codigoMuestra: "ZZX9999" }, 201)));
    await createSample({ codigoMuestra: "ZZX9999", nombreEstacion: "Est", nombreRoca: "Granito", tipoAnalisis: "Seccion Delgada", fecha: "2024-05-01" });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/samples");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json", Authorization: getAuthHeader() });
    expect(JSON.parse(String(init.body))).toMatchObject({ codigoMuestra: "ZZX9999" });
  });

  it("throws ApiError with status 409 on duplicate codes", async () => {
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(jsonResponse({ error: "Sample with code ACM0398p already exists" }, 409)));
    const error = await createSample({
      codigoMuestra: "ACM0398p",
      nombreEstacion: "Est",
      nombreRoca: "Granito",
      tipoAnalisis: "Seccion Delgada",
      fecha: "2024-05-01",
    }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(409);
  });
});

describe("exportCsv", () => {
  it("downloads a CSV blob with the current filters", async () => {
    const blob = new Blob(["IGM,CodigoMuestra"], { type: "text/csv; charset=utf-8" });
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(new Response(blob, { status: 200 })));
    const createObjectURL = vi.fn(() => "blob:mock");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    await exportCsv({ rock: "Granito" });

    expect(fetchMock).toHaveBeenCalledWith("/api/samples/export?rock=Granito", expect.anything());
    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");

    clickSpy.mockRestore();
  });

  it("throws ApiError when the export fails", async () => {
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(new Response(null, { status: 401 })));
    await expect(exportCsv({})).rejects.toMatchObject({ status: 401 });
  });
});