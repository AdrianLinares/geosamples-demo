// Sample routes (design D4, specs sample-query / sample-registration /
// csv-export / admin-auth). Mounted at /api: /samples, /samples/export,
// /samples/:code, /meta.

import { Router, type NextFunction, type Request, type Response } from "express";
import { pool } from "../config/db.js";
import {
  normalizeBlank,
  normalizeDate,
  normalizeKey,
  normalizeNumber,
} from "../ingest/normalize.js";
import {
  CANONICAL_ANALYSES,
  CANONICAL_COLLECTORS,
  CANONICAL_ROCKS,
  PROYECTO,
  SISTEMA_COORDENADAS,
  resolveAnalysis,
  resolveCollector,
  resolveRock,
} from "../ingest/canonical.js";
import type { CanonicalEntry, Sample, SampleFilters } from "../types.js";
import { adminAuthMiddleware, readAuth } from "../middlewares/auth.js";

export const router = Router();

const SELECT_COLUMNS = `
  SELECT s.id, s.igm, s.codigo_muestra, s.nombre_estacion, s.estacion_companero,
         s.simbolo_ug, s.ug_mapa, s.descripcion_muestra, s.localizacion, s.plancha,
         s.norte, s.este, s.altura, to_char(s.fecha, 'YYYY-MM-DD') AS fecha,
         s.existe_muestra, r.name AS nombre_roca, c.name AS nombre_colector,
         a.name AS tipo_analisis
  FROM samples s
  JOIN rock_types r ON r.id = s.rock_type_id
  LEFT JOIN collectors c ON c.id = s.collector_id
  JOIN analysis_types a ON a.id = s.analysis_type_id`;

type DbSampleRow = {
  id: number;
  igm: string | null;
  codigo_muestra: string;
  nombre_estacion: string;
  estacion_companero: string | null;
  simbolo_ug: string | null;
  ug_mapa: string | null;
  descripcion_muestra: string;
  localizacion: string;
  plancha: string;
  norte: number | null;
  este: number | null;
  altura: number | null;
  fecha: string;
  existe_muestra: boolean | null;
  nombre_roca: string;
  nombre_colector: string | null;
  tipo_analisis: string;
};

function rowToSample(r: DbSampleRow): Sample {
  return {
    id: r.id,
    igm: r.igm,
    codigoMuestra: r.codigo_muestra,
    nombreEstacion: r.nombre_estacion,
    estacionCompanero: r.estacion_companero,
    simboloUG: r.simbolo_ug,
    ugMapa: r.ug_mapa,
    descripcionMuestra: r.descripcion_muestra,
    nombreRoca: r.nombre_roca,
    localizacion: r.localizacion,
    plancha: r.plancha,
    norte: r.norte,
    este: r.este,
    altura: r.altura,
    fecha: r.fecha,
    nombreColector: r.nombre_colector,
    existeMuestra: r.existe_muestra,
    tipoAnalisis: r.tipo_analisis,
  };
}

// ---------------------------------------------------------------------------
// Filter → WHERE builder. Condition order is FIXED: code, rock, unit,
// collector, analysis, plancha, dateFrom, dateTo, q, norteMin, norteMax,
// esteMin, esteMax (the mock pool in api.test.ts relies on this exact order).
// ---------------------------------------------------------------------------

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

function validateBbox(filters: SampleFilters): string | null {
  if (filters.norteMin !== undefined && filters.norteMax !== undefined && filters.norteMin > filters.norteMax) {
    return "norteMin must be less than or equal to norteMax";
  }
  if (filters.esteMin !== undefined && filters.esteMax !== undefined && filters.esteMin > filters.esteMax) {
    return "esteMin must be less than or equal to esteMax";
  }
  return null;
}

function buildWhere(filters: SampleFilters): { conditions: string[]; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (filters.code !== undefined && filters.code !== "") {
    params.push(filters.code.trim());
    conditions.push(`lower(s.codigo_muestra) = lower($${params.length})`);
  }
  if (filters.rock !== undefined && filters.rock !== "") {
    params.push(normalizeKey(filters.rock));
    conditions.push(`r.normalized_key = $${params.length}`);
  }
  if (filters.unit !== undefined && filters.unit !== "") {
    params.push(`%${escapeLike(filters.unit)}%`);
    conditions.push(`(s.ug_mapa ILIKE $${params.length} OR s.simbolo_ug ILIKE $${params.length})`);
  }
  if (filters.collector !== undefined && filters.collector !== "") {
    params.push(normalizeKey(filters.collector));
    conditions.push(`c.normalized_key = $${params.length}`);
  }
  if (filters.analysis !== undefined && filters.analysis !== "") {
    params.push(normalizeKey(filters.analysis));
    conditions.push(`a.normalized_key = $${params.length}`);
  }
  if (filters.plancha !== undefined && filters.plancha !== "") {
    params.push(`%${escapeLike(filters.plancha)}%`);
    conditions.push(`s.plancha ILIKE $${params.length}`);
  }
  if (filters.dateFrom !== undefined && filters.dateFrom !== "") {
    params.push(filters.dateFrom);
    conditions.push(`s.fecha >= $${params.length}`);
  }
  if (filters.dateTo !== undefined && filters.dateTo !== "") {
    params.push(filters.dateTo);
    conditions.push(`s.fecha <= $${params.length}`);
  }
  if (filters.q !== undefined && filters.q !== "") {
    params.push(`%${escapeLike(filters.q)}%`);
    conditions.push(
      `(s.descripcion_muestra ILIKE $${params.length} OR s.localizacion ILIKE $${params.length})`,
    );
  }
  if (filters.norteMin !== undefined) {
    params.push(filters.norteMin);
    conditions.push(`s.norte >= $${params.length}`);
  }
  if (filters.norteMax !== undefined) {
    params.push(filters.norteMax);
    conditions.push(`s.norte <= $${params.length}`);
  }
  if (filters.esteMin !== undefined) {
    params.push(filters.esteMin);
    conditions.push(`s.este >= $${params.length}`);
  }
  if (filters.esteMax !== undefined) {
    params.push(filters.esteMax);
    conditions.push(`s.este <= $${params.length}`);
  }
  return { conditions, params };
}

const whereClause = (conditions: string[]): string =>
  conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

function parseFilters(query: Request["query"]): SampleFilters {
  const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
  const int = (v: unknown): number | undefined => {
    const s = str(v);
    if (s === undefined) return undefined;
    const n = Number.parseInt(s, 10);
    return Number.isNaN(n) ? undefined : n;
  };
  const num = (v: unknown): number | undefined => {
    const s = str(v);
    if (s === undefined) return undefined;
    const n = Number.parseFloat(s);
    return Number.isNaN(n) ? undefined : n;
  };
  return {
    code: str(query.code),
    rock: str(query.rock),
    unit: str(query.unit),
    collector: str(query.collector),
    analysis: str(query.analysis),
    plancha: str(query.plancha),
    dateFrom: str(query.dateFrom),
    dateTo: str(query.dateTo),
    q: str(query.q),
    norteMin: num(query.norteMin),
    norteMax: num(query.norteMax),
    esteMin: num(query.esteMin),
    esteMax: num(query.esteMax),
    page: int(query.page),
    pageSize: int(query.pageSize),
  };
}

// ---------------------------------------------------------------------------
// CSV export (spec csv-export)
// ---------------------------------------------------------------------------

const CSV_COLUMNS = [
  "IGM", "CodigoMuestra", "NombreEstacion", "EstacionCompanero", "SimboloUG",
  "UGMapa", "DescripcionMuestra", "NombreRoca", "Localizacion", "Plancha",
  "Norte", "Este", "Altura", "Fecha", "NombreColector", "ExisteMuestra", "TipoAnalisis",
] as const;

function csvField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows: Sample[]): string {
  const header = CSV_COLUMNS.join(",");
  const lines = rows.map((row) =>
    [
      row.igm,
      row.codigoMuestra,
      row.nombreEstacion,
      row.estacionCompanero,
      row.simboloUG,
      row.ugMapa,
      row.descripcionMuestra,
      row.nombreRoca,
      row.localizacion,
      row.plancha,
      row.norte,
      row.este,
      row.altura,
      row.fecha,
      row.nombreColector,
      row.existeMuestra === null ? null : row.existeMuestra ? "Si" : "No",
      row.tipoAnalisis,
    ]
      .map(csvField)
      .join(","),
  );
  return [header, ...lines].join("\n");
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

router.get("/samples", readAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = parseFilters(req.query);
    const bboxError = validateBbox(filters);
    if (bboxError !== null) {
      res.status(400).json({ error: bboxError });
      return;
    }
    const { conditions, params } = buildWhere(filters);
    const where = whereClause(conditions);

    const countResult = await pool.query<{ n: number }>(
      `SELECT count(*)::int AS n FROM samples s
       JOIN rock_types r ON r.id = s.rock_type_id
       LEFT JOIN collectors c ON c.id = s.collector_id
       JOIN analysis_types a ON a.id = s.analysis_type_id${where}`,
      params,
    );
    const total = countResult.rows[0]!.n;

    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 25));
    const offset = (page - 1) * pageSize;

    const listResult = await pool.query<DbSampleRow>(
      `${SELECT_COLUMNS}${where} ORDER BY s.codigo_muestra LIMIT ${pageSize} OFFSET ${offset}`,
      params,
    );
    res.json({ data: listResult.rows.map(rowToSample), total, page, pageSize });
  } catch (error) {
    next(error);
  }
});

// /samples/export MUST be registered before /samples/:code (Express 5).
router.get("/samples/export", readAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = parseFilters(req.query);
    const bboxError = validateBbox(filters);
    if (bboxError !== null) {
      res.status(400).json({ error: bboxError });
      return;
    }
    const { conditions, params } = buildWhere(filters);
    const where = whereClause(conditions);
    const listResult = await pool.query<DbSampleRow>(
      `${SELECT_COLUMNS}${where} ORDER BY s.codigo_muestra`,
      params,
    );
    const csv = toCsv(listResult.rows.map(rowToSample));
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="samples.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

router.get("/samples/:code", readAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query<DbSampleRow>(
      `${SELECT_COLUMNS} WHERE lower(s.codigo_muestra) = lower($1)`,
      [String(req.params.code).trim()],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Sample not found" });
      return;
    }
    res.json(rowToSample(result.rows[0]!));
  } catch (error) {
    next(error);
  }
});

router.get("/meta", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [rocks, collectors, analyses] = await Promise.all([
      pool.query<CanonicalEntry>("SELECT id, name, normalized_key FROM rock_types ORDER BY name"),
      pool.query<CanonicalEntry>("SELECT id, name, normalized_key FROM collectors ORDER BY name"),
      pool.query<CanonicalEntry>("SELECT id, name, normalized_key FROM analysis_types ORDER BY name"),
    ]);
    res.json({
      rockTypes: rocks.rows,
      collectors: collectors.rows,
      analysisTypes: analyses.rows,
      constants: { sistemaCoordenadas: SISTEMA_COORDENADAS, proyecto: PROYECTO },
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// Registration (spec sample-registration) — always requires admin auth.
// ---------------------------------------------------------------------------

type RegistrationPayload = {
  igm?: unknown;
  codigoMuestra?: unknown;
  nombreEstacion?: unknown;
  estacionCompanero?: unknown;
  simboloUG?: unknown;
  ugMapa?: unknown;
  descripcionMuestra?: unknown;
  localizacion?: unknown;
  plancha?: unknown;
  norte?: unknown;
  este?: unknown;
  altura?: unknown;
  fecha?: unknown;
  nombreColector?: unknown;
  existeMuestra?: unknown;
  nombreRoca?: unknown;
  tipoAnalisis?: unknown;
};

type NormalizedRegistration = {
  igm: string | null;
  codigoMuestra: string;
  nombreEstacion: string;
  estacionCompanero: string | null;
  simboloUG: string | null;
  ugMapa: string | null;
  descripcionMuestra: string;
  localizacion: string;
  plancha: string;
  norte: number | null;
  este: number | null;
  altura: number | null;
  fecha: string;
  nombreColector: string | null;
  existeMuestra: boolean | null;
  nombreRoca: string;
  tipoAnalisis: string;
};

type RegistrationResult =
  | { record: NormalizedRegistration; error: null }
  | { record: null; error: string };

function normalizeRegistrationPayload(body: unknown): RegistrationResult {
  const invalid = (message: string): RegistrationResult => ({ record: null, error: message });
  const b = (body ?? {}) as RegistrationPayload;

  const codigoMuestra = normalizeBlank(typeof b.codigoMuestra === "string" ? b.codigoMuestra : "");
  if (codigoMuestra === null) return invalid("CodigoMuestra is required");
  const nombreEstacion = normalizeBlank(typeof b.nombreEstacion === "string" ? b.nombreEstacion : "");
  if (nombreEstacion === null) return invalid("NombreEstacion is required");
  const nombreRocaRaw = normalizeBlank(typeof b.nombreRoca === "string" ? b.nombreRoca : "");
  if (nombreRocaRaw === null) return invalid("NombreRoca is required");

  const fechaRaw = typeof b.fecha === "string" ? b.fecha : "";
  const fecha = normalizeDate(fechaRaw);
  if (fecha === null || !isValidIsoDate(fecha)) return invalid("Fecha must be a valid ISO date (YYYY-MM-DD)");

  for (const key of ["norte", "este", "altura"] as const) {
    const v = b[key];
    if (v !== undefined && v !== null && v !== "" && typeof v !== "number") {
      return invalid(`${key[0]!.toUpperCase() + key.slice(1)} must be numeric`);
    }
  }
  const norte = normalizeNumber(typeof b.norte === "string" ? b.norte : b.norte === undefined ? "" : String(b.norte));
  const este = normalizeNumber(typeof b.este === "string" ? b.este : b.este === undefined ? "" : String(b.este));
  const altura = normalizeNumber(typeof b.altura === "string" ? b.altura : b.altura === undefined ? "" : String(b.altura));

  const canonicalRock = resolveRock(nombreRocaRaw);
  if (!CANONICAL_ROCKS.includes(canonicalRock)) return invalid("NombreRoca is not a canonical rock type");

  const tipoAnalisisRaw = normalizeBlank(typeof b.tipoAnalisis === "string" ? b.tipoAnalisis : "");
  if (tipoAnalisisRaw === null) return invalid("TipoAnalisis is required");
  const canonicalAnalysis = resolveAnalysis(tipoAnalisisRaw);
  if (!CANONICAL_ANALYSES.includes(canonicalAnalysis)) return invalid("TipoAnalisis must be one of the four canonical analysis types");

  let canonicalCollector: string | null = null;
  const collectorRaw = normalizeBlank(typeof b.nombreColector === "string" ? b.nombreColector : "");
  if (collectorRaw !== null) {
    canonicalCollector = resolveCollector(collectorRaw);
    if (!CANONICAL_COLLECTORS.includes(canonicalCollector)) {
      return invalid("NombreColector is not a canonical collector");
    }
  }

  return {
    error: null,
    record: {
      igm: normalizeBlank(typeof b.igm === "string" ? b.igm : ""),
      codigoMuestra,
      nombreEstacion,
      estacionCompanero: normalizeBlank(typeof b.estacionCompanero === "string" ? b.estacionCompanero : ""),
      simboloUG: normalizeBlank(typeof b.simboloUG === "string" ? b.simboloUG : ""),
      ugMapa: normalizeBlank(typeof b.ugMapa === "string" ? b.ugMapa : ""),
      descripcionMuestra: normalizeBlank(typeof b.descripcionMuestra === "string" ? b.descripcionMuestra : "") ?? "",
      localizacion: normalizeBlank(typeof b.localizacion === "string" ? b.localizacion : "") ?? "",
      plancha: normalizeBlank(typeof b.plancha === "string" ? b.plancha : "") ?? "",
      norte,
      este,
      altura,
      fecha,
      nombreColector: canonicalCollector,
      existeMuestra:
        typeof b.existeMuestra === "boolean"
          ? b.existeMuestra
          : normalizeBooleanLike(b.existeMuestra),
      nombreRoca: canonicalRock,
      tipoAnalisis: canonicalAnalysis,
    },
  };
}

/** Real calendar check: "2024-13-40" is \d{4}-\d{2}-\d{2} but not a date. */
function isValidIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1) return false;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return d <= daysInMonth;
}

function normalizeBooleanLike(v: unknown): boolean | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  if (s === "si" || s === "true" || s === "1") return true;
  if (s === "no" || s === "false" || s === "0") return false;
  return null;
}

router.post("/samples", adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { record, error } = normalizeRegistrationPayload(req.body);
    if (error !== null) {
      res.status(400).json({ error });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const lookup = async (table: "rock_types" | "collectors" | "analysis_types", key: string) => {
        const result = await client.query<{ id: number }>(
          `SELECT id FROM ${table} WHERE normalized_key = $1`,
          [key],
        );
        if (result.rows.length === 0) {
          throw Object.assign(new Error(`Lookup missing for ${table}: ${key}`), { status: 400 });
        }
        return result.rows[0]!.id;
      };

      const rockTypeId = await lookup("rock_types", normalizeKey(record.nombreRoca));
      const analysisTypeId = await lookup("analysis_types", normalizeKey(record.tipoAnalisis));
      const collectorId =
        record.nombreColector === null ? null : await lookup("collectors", normalizeKey(record.nombreColector));

      let insert: { rowCount: number | null };
      try {
        insert = await client.query(
          `INSERT INTO samples (
             igm, codigo_muestra, nombre_estacion, estacion_companero, simbolo_ug, ug_mapa,
             descripcion_muestra, localizacion, plancha, norte, este, altura, fecha,
             collector_id, existe_muestra, rock_type_id, analysis_type_id
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
           ON CONFLICT DO NOTHING`,
          [
            record.igm,
            record.codigoMuestra,
            record.nombreEstacion,
            record.estacionCompanero,
            record.simboloUG,
            record.ugMapa,
            record.descripcionMuestra,
            record.localizacion,
            record.plancha,
            record.norte,
            record.este,
            record.altura,
            record.fecha,
            collectorId,
            record.existeMuestra,
            rockTypeId,
            analysisTypeId,
          ],
        );
      } catch (insertError) {
        // Unique violation on lower(codigo_muestra) → duplicate code.
        if (isUniqueViolation(insertError)) {
          await client.query("ROLLBACK");
          res.status(409).json({ error: `Sample with code ${record.codigoMuestra} already exists` });
          return;
        }
        throw insertError;
      }

      if ((insert.rowCount ?? 0) === 0) {
        // ON CONFLICT DO NOTHING consumed the row → duplicate code.
        await client.query("ROLLBACK");
        res.status(409).json({ error: `Sample with code ${record.codigoMuestra} already exists` });
        return;
      }

      await client.query("COMMIT");

      const created = await pool.query<DbSampleRow>(
        `${SELECT_COLUMNS} WHERE lower(s.codigo_muestra) = lower($1)`,
        [record.codigoMuestra],
      );
      res.status(201).json(rowToSample(created.rows[0]!));
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "23505";
}

// 404 handler for unknown routes under /api.
router.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});