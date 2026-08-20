// Seed-path mock for spec sample-ingest R10 ("seed is idempotent").
// Simulates a Postgres where run 1 inserts all 99 sample rows and run 2 hits
// ON CONFLICT DO NOTHING on every row: 0 new rows, no duplicate-key errors.
// The sample row set is a Set keyed by codigo_muestra, so re-inserting the same
// 99 codes never grows the count — mirroring the real unique constraint.
// Lookup tables (rock_types/collectors/analysis_types) are derived from the
// real TSV via the same canonical functions seed() uses, so every
// `SELECT id, normalized_key FROM ...` resolves exactly the keys seed() asks for.
//
// NOTE: this file must NOT import seed.js (nor anything that imports "pg"):
// it is loaded from the vi.mock("pg") factory, so importing seed.js would
// create a circular import through the mocked module.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolveAnalysis, resolveCollector, resolveRock } from "../src/ingest/canonical.js";
import { normalizeKey, normalizeRow } from "../src/ingest/normalize.js";

const TSV_PATH = fileURLToPath(new URL("../../data/muestras.tsv", import.meta.url));

const lookupRows: Record<string, { id: number; normalized_key: string }[]> = {
  rock_types: [],
  collectors: [],
  analysis_types: [],
};

// Derive the exact lookup rows seed() will request (same canonical pipeline).
{
  const lines = readFileSync(TSV_PATH, "utf8").split("\n").slice(1); // skip header
  const records = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => normalizeRow(line.split("\t"))); // normalizeRow validates 20 columns
  const rocks = new Map<string, string>();
  const collectors = new Map<string, string>();
  const analyses = new Map<string, string>();
  for (const rec of records) {
    const rock = resolveRock(rec.nombreRoca);
    rocks.set(normalizeKey(rock), rock);
    if (rec.nombreColector !== null) {
      const collector = resolveCollector(rec.nombreColector);
      collectors.set(normalizeKey(collector), collector);
    }
    const analysis = resolveAnalysis(rec.tipoAnalisis);
    analyses.set(normalizeKey(analysis), analysis);
  }
  lookupRows.rock_types = [...rocks.keys()].map((key, i) => ({ id: i + 1, normalized_key: key }));
  lookupRows.collectors = [...collectors.keys()].map((key, i) => ({ id: i + 1, normalized_key: key }));
  lookupRows.analysis_types = [...analyses.keys()].map((key, i) => ({ id: i + 1, normalized_key: key }));
}

let active: SeedMockPool | null = null;

export class SeedMockPool {
  samples: Set<string>;
  insertsSeen: number;

  constructor() {
    this.samples = new Set();
    this.insertsSeen = 0;
    active = this;
  }

  query(sql: string, params: unknown[] = []) {
    if (sql.includes("BEGIN") || sql.includes("COMMIT") || sql.includes("ROLLBACK")) {
      return Promise.resolve({ rows: [], rowCount: 0 });
    }
    if (sql.startsWith("INSERT INTO samples")) {
      this.insertsSeen += 1;
      this.samples.add(String(params[1] ?? "")); // Set dedupes → run 2 adds 0 rows
      return Promise.resolve({ rows: [], rowCount: 1 });
    }
    if (sql.startsWith("INSERT INTO")) {
      // Lookup upserts: conflicts are skipped the same way as the real DDL.
      return Promise.resolve({ rows: [], rowCount: 0 });
    }
    if (sql.includes("SELECT id, normalized_key FROM")) {
      const table = /FROM (\w+)/.exec(sql)?.[1] ?? "";
      return Promise.resolve({ rows: lookupRows[table] ?? [] });
    }
    if (sql.includes("count(*)") && sql.includes("FROM samples")) {
      return Promise.resolve({ rows: [{ n: this.samples.size }] });
    }
    if (sql.includes("count(*)") && sql.includes("FROM rock_types")) {
      return Promise.resolve({ rows: [{ n: lookupRows.rock_types.length }] });
    }
    throw new Error(`Unhandled seed query: ${sql}`);
  }

  connect() {
    return Promise.resolve({
      query: (sql: string, params?: unknown[]) => this.query(sql, params ?? []),
      release: () => {},
    });
  }
}

export const resetMock = () => {
  // The app's Pool is a module-level singleton (config/db.ts) built at import
  // time, so this resets the STATE of the active instance instead of dropping
  // the reference — seed() keeps using the same mock across tests.
  if (active !== null) {
    active.samples = new Set();
    active.insertsSeen = 0;
  }
};

export const getActiveMock = (): SeedMockPool => {
  if (active === null) throw new Error("SeedMockPool was never instantiated");
  return active;
};