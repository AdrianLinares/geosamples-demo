// PostgreSQL connection pool (design D4 / task 2.4).
// Reads DATABASE_URL, with a default that matches docker-compose.yml so the
// zero-config harness `docker compose up -d && pnpm seed` works out of the box.

import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://geosamples:geosamples@localhost:5432/geosamples";

export const pool = new Pool({ connectionString, max: 10 });