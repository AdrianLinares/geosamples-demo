# Geosamples — INVEMAR Geological-Sample Catalog

Greenfield demo of a geological-sample registration and query system for INVEMAR
(99 records). pnpm monorepo: React 19 + Vite 7 + TypeScript SPA (`src/`) and
Express 5 + TypeScript API (`server/`) backed by PostgreSQL.

## Quickstart

Prerequisites: Node.js ≥ 20, pnpm ≥ 9.

```bash
pnpm install
docker compose up -d          # optional: Postgres 16 (port 5432)
cp .env.example .env          # adjust values if needed
pnpm seed                     # load data/muestras.tsv (idempotent; needs the DB)
pnpm dev:server               # API on http://localhost:3001
pnpm dev                      # SPA on http://localhost:5173 (proxies /api → :3001)
```

The SPA dev server proxies `/api` requests to the API, so both processes run
side by side with no CORS setup.

## Scripts

| Script                | Description                                            |
|-----------------------|--------------------------------------------------------|
| `pnpm dev`            | Vite dev server for the SPA (port 5173)                |
| `pnpm dev:server`     | API in watch mode via tsx (port 3001, TZ America/Bogota) |
| `pnpm seed`           | Idempotent TSV ingest into Postgres                    |
| `pnpm build`          | Typecheck + production SPA build to `dist/`            |
| `pnpm preview`        | Serve the built SPA locally                            |
| `pnpm test`           | Full vitest suite (server + SPA)                       |
| `pnpm test:ingest`    | Normalizer + canonical tests                           |
| `pnpm test:api`       | API contract tests (mocked pg)                         |
| `pnpm test:spa`       | SPA component tests (happy-dom + testing-library)      |
| `pnpm typecheck:server`| Server TypeScript check (NodeNext)                    |

## Environment Variables

| Variable       | Default                        | Description                                             |
|----------------|--------------------------------|---------------------------------------------------------|
| `DATABASE_URL` | `postgres://geosamples:geosamples@localhost:5432/geosamples` | `pg` connection string |
| `PORT`         | `3001`                         | API listen port                                         |
| `ADMIN_USERS`  | —                              | Comma-separated `username:bcrypt-hash` pairs; empty → all admin ops fail closed |
| `AUTH_READS`   | `false`                        | `true` requires admin auth on read/export routes too    |

Generate a bcrypt hash for `ADMIN_USERS` with:

```bash
pnpm exec tsx -e "import bcrypt from 'bcryptjs'; console.log(bcrypt.hashSync('your-password', 10))"
```

## API Summary

| Method | Path                      | Description                                      |
|--------|---------------------------|--------------------------------------------------|
| GET    | `/api/samples`            | Paginated list; filters: `code`, `rock`, `unit`, `collector`, `analysis`, `plancha`, `dateFrom`, `dateTo`, `q`; `page`, `pageSize` (max 100) |
| GET    | `/api/samples/:code`      | Single sample by code (case-insensitive), 404 if missing |
| GET    | `/api/samples/export`     | CSV download of the current filter result (no BOM, quoted fields) |
| POST   | `/api/samples`            | Register a sample (admin auth required): 201 / 400 / 409 |
| GET    | `/api/meta`               | Canonical rock/collector/analysis catalogs + project constants |
| GET    | `/health`                 | Liveness probe                                     |

Reads are public by default; registration always requires valid `ADMIN_USERS`
credentials (HTTP Basic). The SPA asks for admin credentials when a
registration returns 401 and stores them in `sessionStorage` for the session.

## Project Layout

```
src/                  SPA (React 19 + Vite 7 + Tailwind)
  components/         FilterBar, SampleTable, RegistrationForm
  services/api.ts     typed fetch client (Basic auth, CSV download)
server/src/           Express API
  ingest/             TSV parse → normalize → canonicalize → seed
  middlewares/auth.ts HTTP Basic admin auth (fail closed)
  routes/samples.ts   query / registration / export / meta
schema.sql            Postgres DDL (samples + canonical lookup tables)
openspec/             Specs, design, and tasks for the initial-system change
```

## Testing

The API suite runs against a mocked `pg` Pool (deterministic, no database
needed). The SPA suite uses happy-dom + testing-library and mocks the API
module. Run everything with `pnpm test`.