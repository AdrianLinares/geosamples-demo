-- Geosamples catalog schema (Postgres 16)
-- Mirrors SGC-MICRORESERVA: canonical lookups + one samples table.

-- Canonical rock types. normalized_key gives case/accent-insensitive identity.
CREATE TABLE IF NOT EXISTS rock_types (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  normalized_key TEXT NOT NULL UNIQUE
);

-- Canonical collectors.
CREATE TABLE IF NOT EXISTS collectors (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  normalized_key TEXT NOT NULL UNIQUE
);

-- Canonical analysis types (exactly four, seeded below).
CREATE TABLE IF NOT EXISTS analysis_types (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  normalized_key TEXT NOT NULL UNIQUE
);

-- Samples. 17 domain columns (SubUnidad and per-record coordinate/project
-- constants are NOT modeled; those are metadata constants).
CREATE TABLE IF NOT EXISTS samples (
  id                  SERIAL PRIMARY KEY,
  igm                 TEXT,
  codigo_muestra      TEXT NOT NULL,
  nombre_estacion     TEXT NOT NULL,
  estacion_companero  TEXT,
  simbolo_ug          TEXT,
  ug_mapa             TEXT,
  descripcion_muestra TEXT NOT NULL DEFAULT '',
  localizacion        TEXT NOT NULL DEFAULT '',
  plancha             TEXT NOT NULL DEFAULT '',
  norte               DOUBLE PRECISION,
  este                DOUBLE PRECISION,
  altura              DOUBLE PRECISION,
  fecha               DATE NOT NULL,
  collector_id        INTEGER REFERENCES collectors(id) ON DELETE RESTRICT,
  existe_muestra      BOOLEAN,
  rock_type_id        INTEGER NOT NULL REFERENCES rock_types(id) ON DELETE RESTRICT,
  analysis_type_id    INTEGER NOT NULL REFERENCES analysis_types(id) ON DELETE RESTRICT
);

-- Case-insensitive identity on codigo_muestra (spec sample-catalog R6).
-- A plain UNIQUE table constraint cannot use lower(); Postgres requires an
-- expression index for case-insensitive uniqueness.
CREATE UNIQUE INDEX IF NOT EXISTS idx_samples_codigo_muestra_ci ON samples (lower(codigo_muestra));

CREATE INDEX IF NOT EXISTS idx_samples_codigo_muestra ON samples (codigo_muestra);
CREATE INDEX IF NOT EXISTS idx_samples_rock_type_id ON samples (rock_type_id);
CREATE INDEX IF NOT EXISTS idx_samples_collector_id ON samples (collector_id);
CREATE INDEX IF NOT EXISTS idx_samples_analysis_type_id ON samples (analysis_type_id);

-- The four canonical analysis types are fixed by the catalog spec.
INSERT INTO analysis_types (name, normalized_key) VALUES
  ('Seccion Delgada', 'seccion delgada'),
  ('Dataciones Radiometricas', 'dataciones radiometricas'),
  ('Analisis Macro', 'analisis macro'),
  ('Bioestratigrafia', 'bioestratigrafia')
ON CONFLICT (normalized_key) DO NOTHING;
