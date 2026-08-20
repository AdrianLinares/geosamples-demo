// Canonicalization tests against the REAL data (design D3, spec sample-ingest).
// The canonical alias map must be curated so that no record is dropped and the
// canonical rock list stays under 57 entries.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ANALYSIS_CANONICALS,
  CANONICAL_ANALYSES,
  CANONICAL_COLLECTORS,
  CANONICAL_ROCKS,
  ROCK_CANONICALS,
  resolveAnalysis,
  resolveCollector,
  resolveRock,
} from "../src/ingest/canonical.js";
import { normalizeKey } from "../src/ingest/normalize.js";

const TSV_PATH = fileURLToPath(new URL("../../data/muestras.tsv", import.meta.url));

function distinctColumn(columnIndex: number): string[] {
  const rows = readFileSync(TSV_PATH, "utf8").split("\n").slice(1);
  // Raw cell values: do NOT trim, so whitespace variants stay distinct.
  const values = new Set(rows.map((line) => line.split("\t")[columnIndex]!));
  values.delete("");
  return [...values].sort();
}

const RAW_ROCKS = distinctColumn(8); // NombreRoca
const RAW_COLLECTORS = distinctColumn(17); // NombreColector
const RAW_ANALYSES = distinctColumn(19); // TipoAnalisis

describe("canonical rock catalog (curated against data/muestras.tsv)", () => {
  it("curates the 58 raw rock strings and shrinks the set below 57 canonical entries", () => {
    expect(RAW_ROCKS.length).toBe(58);
    const resolved = new Set(RAW_ROCKS.map((raw) => resolveRock(raw)));
    expect(resolved.size).toBeLessThan(57);
    expect(resolved.size).toBe(CANONICAL_ROCKS.length);
  });

  it("resolves every raw rock to a curated canonical entry (no fallback drift)", () => {
    for (const raw of RAW_ROCKS) {
      expect(CANONICAL_ROCKS).toContain(resolveRock(raw));
    }
  });

  it("maps Cuarzodiorita variants to one canonical entry", () => {
    for (const raw of ["Cuarzodiorita", "cuarzodiorita", "Roca ígnea, cuarzodiorita"]) {
      expect(resolveRock(raw)).toBe("Cuarzodiorita");
    }
  });

  it("strips the trailing question mark from Ultracataclasita ?", () => {
    expect(resolveRock("Ultracataclasita ?")).toBe("Ultracataclasita");
  });

  it("fixes the Pado -> Pardo collector typo", () => {
    expect(resolveCollector("Ana Milena Cardozo y Germán Pado Torres")).toBe(
      "Ana Milena Cardozo y Germán Pardo Torres",
    );
  });

  it("has no normalized-key collisions inside the curated rock list", () => {
    const keys = ROCK_CANONICALS.map((c) => normalizeKey(c.name));
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("canonical collector catalog (curated against data/muestras.tsv)", () => {
  it("resolves every non-blank raw collector to a curated canonical entry", () => {
    expect(RAW_COLLECTORS.length).toBe(16);
    for (const raw of RAW_COLLECTORS) {
      expect(CANONICAL_COLLECTORS).toContain(resolveCollector(raw));
    }
  });

  it("resolves Cortés and Cortes to the same canonical collector", () => {
    expect(resolveCollector("Angela Rincón y Elizabeth Cortés")).toBe(
      resolveCollector("Angela Rincón y Elizabeth Cortes"),
    );
  });

  it("merges reordered collector pairs", () => {
    expect(resolveCollector("Milton Galvis & Elizabeth Cortés")).toBe(
      resolveCollector("Elizabeth Cortés & Milton Galvis"),
    );
  });
});

describe("canonical analysis catalog", () => {
  it("holds exactly the four spec canonical analysis types", () => {
    expect(CANONICAL_ANALYSES).toEqual([
      "Analisis Macro",
      "Bioestratigrafia",
      "Dataciones Radiometricas",
      "Seccion Delgada",
    ]);
    expect(ANALYSIS_CANONICALS).toHaveLength(4);
  });

  it("resolves datacionesradiometricas to Dataciones Radiometricas", () => {
    expect(resolveAnalysis("datacionesradiometricas")).toBe("Dataciones Radiometricas");
    expect(resolveAnalysis("DatacionesRadiometricas")).toBe("Dataciones Radiometricas");
  });

  it("resolves every raw analysis to one of the four canonicals", () => {
    expect(RAW_ANALYSES.length).toBe(4);
    for (const raw of RAW_ANALYSES) {
      expect(CANONICAL_ANALYSES).toContain(resolveAnalysis(raw));
    }
  });
});