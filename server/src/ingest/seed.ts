// Idempotent seed: parse data/muestras.tsv → normalize → canonicalize →
// upsert lookup tables → insert samples with ON CONFLICT DO NOTHING (D5).
// Asserts: 99 records ingested, canonical rock list < 57 entries, no drops.
// The source file is only read — never modified.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { PoolClient } from "pg";
import { pool } from "../config/db.js";
import { normalizeKey, normalizeRow, type NormalizedRecord } from "./normalize.js";
import { resolveAnalysis, resolveCollector, resolveRock } from "./canonical.js";

const DATA_PATH = fileURLToPath(new URL("../../../data/muestras.tsv", import.meta.url));
const EXPECTED_SAMPLES = 99;
const MAX_CANONICAL_ROCKS = 57;

export function parseTsv(text: string): string[][] {
  const lines = text.split("\n");
  if (lines.length < 2) throw new Error(`TSV has no data rows: ${DATA_PATH}`);
  const header = lines[0]!.split("\t");
  if (header.length !== 20) {
    throw new Error(`TSV header must have 20 columns, got ${header.length}`);
  }
  return lines.slice(1).map((line, i) => {
    const cols = line.split("\t");
    if (cols.length !== 20) {
      throw new Error(`Malformed TSV row ${i + 2}: expected 20 columns, got ${cols.length}`);
    }
    return cols;
  });
}

type PreparedRecord = NormalizedRecord & {
  canonicalRock: string;
  canonicalCollector: string | null;
  canonicalAnalysis: string;
};

function prepare(records: NormalizedRecord[]): PreparedRecord[] {
  return records.map((rec) => ({
    ...rec,
    canonicalRock: resolveRock(rec.nombreRoca),
    canonicalCollector: rec.nombreColector === null ? null : resolveCollector(rec.nombreColector),
    canonicalAnalysis: resolveAnalysis(rec.tipoAnalisis),
  }));
}

async function insertLookups(
  client: PoolClient,
  table: "rock_types" | "collectors" | "analysis_types",
  entries: Map<string, string>,
): Promise<Map<string, number>> {
  for (const [normalizedKey, name] of entries) {
    await client.query(
      `INSERT INTO ${table} (name, normalized_key) VALUES ($1, $2)
       ON CONFLICT (normalized_key) DO NOTHING`,
      [name, normalizedKey],
    );
  }
  const result = await client.query<{ normalized_key: string; id: number }>(
    `SELECT id, normalized_key FROM ${table}`,
  );
  return new Map(result.rows.map((row) => [row.normalized_key, row.id]));
}

export async function seed(): Promise<{ samples: number; canonicalRocks: number }> {
  const rawText = readFileSync(DATA_PATH, "utf8");
  const rows = parseTsv(rawText);
  const records = rows.map((cols) => normalizeRow(cols));
  if (records.length !== EXPECTED_SAMPLES) {
    throw new Error(`Expected ${EXPECTED_SAMPLES} records, parsed ${records.length}`);
  }
  const prepared = prepare(records);

  // Unique canonical entries actually used, keyed by normalized_key.
  const rocks = new Map<string, string>();
  const collectors = new Map<string, string>();
  const analyses = new Map<string, string>();
  for (const rec of prepared) {
    rocks.set(normalizeKey(rec.canonicalRock), rec.canonicalRock);
    if (rec.canonicalCollector !== null) {
      collectors.set(normalizeKey(rec.canonicalCollector), rec.canonicalCollector);
    }
    analyses.set(normalizeKey(rec.canonicalAnalysis), rec.canonicalAnalysis);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const rockIdByKey = await insertLookups(client, "rock_types", rocks);
    const collectorIdByKey = await insertLookups(client, "collectors", collectors);
    const analysisIdByKey = await insertLookups(client, "analysis_types", analyses);

    for (const rec of prepared) {
      const rockTypeId = rockIdByKey.get(normalizeKey(rec.canonicalRock));
      const analysisTypeId = analysisIdByKey.get(normalizeKey(rec.canonicalAnalysis));
      const collectorId =
        rec.canonicalCollector === null
          ? null
          : (collectorIdByKey.get(normalizeKey(rec.canonicalCollector)) ?? null);
      if (rockTypeId === undefined || analysisTypeId === undefined) {
        throw new Error(`Lookup id missing for ${rec.codigoMuestra}`);
      }
      await client.query(
        `INSERT INTO samples (
           igm, codigo_muestra, nombre_estacion, estacion_companero, simbolo_ug, ug_mapa,
           descripcion_muestra, localizacion, plancha, norte, este, altura, fecha,
           collector_id, existe_muestra, rock_type_id, analysis_type_id
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         ON CONFLICT DO NOTHING`,
        [
          rec.igm,
          rec.codigoMuestra,
          rec.nombreEstacion,
          rec.estacionCompanero,
          rec.simboloUG,
          rec.ugMapa,
          rec.descripcionMuestra,
          rec.localizacion,
          rec.plancha,
          rec.norte,
          rec.este,
          rec.altura,
          rec.fecha,
          collectorId,
          rec.existeMuestra,
          rockTypeId,
          analysisTypeId,
        ],
      );
    }

    const sampleCount = await client.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM samples",
    );
    const rockCount = await client.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM rock_types",
    );

    if (sampleCount.rows[0]!.n !== EXPECTED_SAMPLES) {
      throw new Error(
        `Seed assertion failed: expected ${EXPECTED_SAMPLES} samples, found ${sampleCount.rows[0]!.n}`,
      );
    }
    if (rockCount.rows[0]!.n >= MAX_CANONICAL_ROCKS) {
      throw new Error(
        `Seed assertion failed: expected < ${MAX_CANONICAL_ROCKS} canonical rocks, found ${rockCount.rows[0]!.n}`,
      );
    }

    await client.query("COMMIT");
    console.log(`Seeded ${sampleCount.rows[0]!.n} samples (source: ${records.length} records, 0 dropped)`);
    console.log(`Canonical rocks in catalog: ${rockCount.rows[0]!.n} (< ${MAX_CANONICAL_ROCKS})`);
    console.log(`Lookup catalog: ${rocks.size} rocks, ${collectors.size} collectors, ${analyses.size} analyses`);
    return { samples: sampleCount.rows[0]!.n, canonicalRocks: rockCount.rows[0]!.n };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  try {
    await seed();
  } catch (error) {
    console.error("Seed failed:", error instanceof Error ? error.message : error);
    console.error("Is Postgres running? Try: docker compose up -d");
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

// Allow direct execution (`pnpm seed`) while keeping `seed()` importable by tests.
if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  void main();
}