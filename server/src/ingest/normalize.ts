// Value normalization pipeline shared by ingest and registration (design D5).

export type NormalizedRecord = {
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
  fecha: string; // ISO YYYY-MM-DD
  nombreColector: string | null;
  existeMuestra: boolean | null;
  nombreRoca: string; // trimmed raw rock name (canonicalized later)
  tipoAnalisis: string; // trimmed raw analysis (canonicalized later)
};

/** Trim; empty becomes null. Never returns placeholder text. */
export function normalizeBlank(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Strip combining diacritics (á→a, ñ→n, ü→u, ...). */
export function foldAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Canonical identity key: trim, lowercase, accent-fold, drop trailing
 * uncertainty markers (`?`, `.`), collapse internal whitespace.
 */
export function normalizeKey(value: string): string {
  return foldAccents(value.trim().toLowerCase())
    .replace(/[?.\s]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Convert `D/M/YYYY` to ISO `YYYY-MM-DD`. Blank → null; unparseable → trimmed original (never drop). */
export function normalizeDate(value: string | null | undefined): string | null {
  const trimmed = normalizeBlank(value);
  if (trimmed === null) return null;
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (match === null) return trimmed;
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  return `${match[3]}-${month}-${day}`;
}

/** Numeric parse; blank → null; unparseable → null (never throws). */
export function normalizeNumber(value: string | null | undefined): number | null {
  const trimmed = normalizeBlank(value);
  if (trimmed === null) return null;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

/** Boolean mapping for ExisteMuestra: `Si` → true, `No` → false, blank → null. */
export function normalizeBoolean(value: string | null | undefined): boolean | null {
  const trimmed = normalizeBlank(value);
  if (trimmed === null) return null;
  const folded = foldAccents(trimmed).toLowerCase();
  if (folded === "si" || folded === "true" || folded === "1") return true;
  if (folded === "no" || folded === "false" || folded === "0") return false;
  return null;
}

/**
 * Map a raw 20-column TSV row (positional) to a typed, normalized record.
 * Required fields fail loudly instead of dropping the record.
 */
export function normalizeRow(cols: readonly string[]): NormalizedRecord {
  if (cols.length !== 20) {
    throw new Error(`Malformed row: expected 20 columns, got ${cols.length}`);
  }
  const codigoMuestra = normalizeBlank(cols[1]);
  if (codigoMuestra === null) throw new Error("Row missing required CodigoMuestra");
  const nombreEstacion = normalizeBlank(cols[2]);
  if (nombreEstacion === null) throw new Error(`Row ${codigoMuestra} missing NombreEstacion`);
  const nombreRoca = normalizeBlank(cols[8]);
  if (nombreRoca === null) throw new Error(`Row ${codigoMuestra} missing NombreRoca`);
  const tipoAnalisis = normalizeBlank(cols[19]);
  if (tipoAnalisis === null) throw new Error(`Row ${codigoMuestra} missing TipoAnalisis`);
  const fecha = normalizeDate(cols[15]);
  if (fecha === null) throw new Error(`Row ${codigoMuestra} missing Fecha`);

  return {
    igm: normalizeBlank(cols[0]),
    codigoMuestra,
    nombreEstacion,
    estacionCompanero: normalizeBlank(cols[3]),
    simboloUG: normalizeBlank(cols[4]),
    ugMapa: normalizeBlank(cols[5]),
    descripcionMuestra: normalizeBlank(cols[7]) ?? "",
    localizacion: normalizeBlank(cols[9]) ?? "",
    plancha: normalizeBlank(cols[10]) ?? "",
    norte: normalizeNumber(cols[11]),
    este: normalizeNumber(cols[12]),
    altura: normalizeNumber(cols[13]),
    fecha,
    nombreColector: normalizeBlank(cols[17]),
    existeMuestra: normalizeBoolean(cols[18]),
    nombreRoca,
    tipoAnalisis,
  };
}
