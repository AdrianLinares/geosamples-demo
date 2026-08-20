// Normalization + ingest pipeline tests (design D5, spec sample-ingest).
// Unit-level: value normalization and row normalization against the real TSV.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import {
  foldAccents,
  normalizeBlank,
  normalizeBoolean,
  normalizeDate,
  normalizeKey,
  normalizeNumber,
  normalizeRow,
} from "../src/ingest/normalize.js";
import { parseTsv, seed } from "../src/ingest/seed.js";

vi.mock("pg", async () => ({ Pool: (await import("./seed-mock.js")).SeedMockPool }));

const TSV_PATH = fileURLToPath(new URL("../../data/muestras.tsv", import.meta.url));

// Fixture: row 1 of data/muestras.tsv (ACM0397A), 20 columns.
const FULL_ROW = [
  "", // IGM
  "ACM0397A", // CodigoMuestra
  "ACM0397", // NombreEstacion
  "ECM0324", // EstacionCompanero
  "", // SimboloUG
  "", // UGMapa
  "", // SubUnidad (not modeled)
  "Se realiza reconocimiento de los insenberg.", // DescripcionMuestra
  "Granito", // NombreRoca
  "Playa Salguero", // Localizacion
  "11IVC", // Plancha
  "1728489", // Norte
  "982508", // Este
  "3", // Altura
  "Magna Colombia Bogotá", // SistemaCoordenadas
  "3/11/2019", // Fecha
  "Investigación Maritima, Costera e Insular", // Proyecto
  "Andrea Carolina Matajira Pabon", // NombreColector
  "", // ExisteMuestra
  "DatacionesRadiometricas", // TipoAnalisis
];

describe("value normalization", () => {
  it("converts D/M/YYYY dates to ISO YYYY-MM-DD with zero-padding", () => {
    expect(normalizeDate("3/11/2019")).toBe("2019-11-03");
    expect(normalizeDate("17/9/2021")).toBe("2021-09-17");
    expect(normalizeDate("01/02/2020")).toBe("2020-02-01");
  });

  it("keeps blank dates null and never drops unparseable values", () => {
    expect(normalizeDate("")).toBeNull();
    expect(normalizeDate("  ")).toBeNull();
    expect(normalizeDate("unknown")).toBe("unknown");
  });

  it("folds accents for canonical identity", () => {
    expect(foldAccents("Esquisto micáceo")).toBe("Esquisto micaceo");
    expect(foldAccents("Roca ígnea, cuarzodiorita")).toBe("Roca ignea, cuarzodiorita");
  });

  it("normalizes keys: trim, lowercase, accent-fold, strip trailing ?, collapse spaces", () => {
    expect(normalizeKey("Ultracataclasita ?")).toBe("ultracataclasita");
    expect(normalizeKey("Esquisto  cuarzo feldespatico ?")).toBe("esquisto cuarzo feldespatico");
    expect(normalizeKey("Roca ígnea, cuarzodiorita")).toBe("roca ignea, cuarzodiorita");
    expect(normalizeKey("  Esquisto  ")).toBe("esquisto");
  });

  it("turns blanks into null, never placeholder text", () => {
    expect(normalizeBlank("")).toBeNull();
    expect(normalizeBlank("   ")).toBeNull();
    expect(normalizeBlank(" x ")).toBe("x");
  });

  it("parses numbers and maps blank to null", () => {
    expect(normalizeNumber("1450")).toBe(1450);
    expect(normalizeNumber("")).toBeNull();
    expect(normalizeNumber("  ")).toBeNull();
  });

  it("maps Si/No booleans and blank to null", () => {
    expect(normalizeBoolean("Si")).toBe(true);
    expect(normalizeBoolean("NO")).toBe(false);
    expect(normalizeBoolean("")).toBeNull();
  });
});

describe("row normalization", () => {
  it("normalizes a complete record", () => {
    const rec = normalizeRow(FULL_ROW);
    expect(rec.codigoMuestra).toBe("ACM0397A");
    expect(rec.estacionCompanero).toBe("ECM0324");
    expect(rec.descripcionMuestra).toContain("insenberg");
    expect(rec.nombreRoca).toBe("Granito");
    expect(rec.plancha).toBe("11IVC");
    expect(rec.norte).toBe(1728489);
    expect(rec.este).toBe(982508);
    expect(rec.altura).toBe(3);
    expect(rec.fecha).toBe("2019-11-03");
    expect(rec.nombreColector).toBe("Andrea Carolina Matajira Pabon");
    expect(rec.existeMuestra).toBeNull();
    expect(rec.tipoAnalisis).toBe("DatacionesRadiometricas");
  });

  it("keeps sparse fields null", () => {
    const sparse = [...FULL_ROW];
    sparse[0] = ""; // IGM
    sparse[3] = ""; // EstacionCompanero
    sparse[13] = ""; // Altura
    sparse[17] = ""; // NombreColector
    sparse[18] = ""; // ExisteMuestra
    const rec = normalizeRow(sparse);
    expect(rec.igm).toBeNull();
    expect(rec.estacionCompanero).toBeNull();
    expect(rec.altura).toBeNull();
    expect(rec.nombreColector).toBeNull();
    expect(rec.existeMuestra).toBeNull();
  });

  it("maps Si to true for ExisteMuestra", () => {
    const row = [...FULL_ROW];
    row[18] = "Si";
    expect(normalizeRow(row).existeMuestra).toBe(true);
  });

  it("fails loudly on a missing required column instead of dropping", () => {
    const bad = [...FULL_ROW];
    bad[1] = ""; // CodigoMuestra
    expect(() => normalizeRow(bad)).toThrow(/CodigoMuestra/);
  });

  it("rejects a row with the wrong column count", () => {
    expect(() => normalizeRow(FULL_ROW.slice(0, 19))).toThrow(/20 columns/);
  });
});

describe("full-file ingest pipeline (data/muestras.tsv)", () => {
  it("parses 99 records and normalizes every one without drops", () => {
    const raw = readFileSync(TSV_PATH, "utf8");
    const rows = parseTsv(raw);
    expect(rows).toHaveLength(99);

    const records = rows.map((cols) => normalizeRow(cols));
    expect(records).toHaveLength(99);
    expect(new Set(records.map((r) => r.codigoMuestra)).size).toBe(99);

    for (const rec of records) {
      expect(rec.codigoMuestra.length).toBeGreaterThan(0);
      expect(rec.nombreEstacion.length).toBeGreaterThan(0);
      expect(rec.nombreRoca.length).toBeGreaterThan(0);
      expect(rec.tipoAnalisis.length).toBeGreaterThan(0);
      expect(rec.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("never modifies the source file (checksum stable across reads)", () => {
    const before = readFileSync(TSV_PATH, "utf8");
    parseTsv(before).map((cols) => normalizeRow(cols));
    const after = readFileSync(TSV_PATH, "utf8");
    expect(after).toBe(before);
  });
});

describe("seed idempotence (spec sample-ingest R10)", () => {
  it("seed is idempotent (R10): second run inserts 0 rows via ON CONFLICT DO NOTHING", async () => {
    const { getActiveMock, resetMock } = await import("./seed-mock.js");
    resetMock();

    const first = await seed();
    const second = await seed();
    const mock = getActiveMock();

    // Assertion path holds on both runs: 99 samples, canonical rocks < 57.
    expect(first.samples).toBe(99);
    expect(first.canonicalRocks).toBeLessThan(57);
    expect(second).toEqual(first);

    // Both runs attempted every row, but the second run added 0 new rows:
    // the row set is keyed by codigo_muestra (unique constraint), so a
    // non-idempotent insert would have doubled the count to 198.
    expect(mock.insertsSeen).toBe(198);
    expect(mock.samples.size).toBe(99);
  });
});