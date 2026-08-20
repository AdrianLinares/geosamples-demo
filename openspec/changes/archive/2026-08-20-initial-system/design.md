# Design: Initial Geological-Sample System (initial-system)

## Technical Approach

Greenfield pnpm monorepo mirroring SGC-MICRORESERVA: React 19 + Vite 6 + TS SPA (`src/`); Express 5 + TS backend (`server/src/`, NodeNext strict, `.js` imports, `TZ=America/Bogota` before imports); PostgreSQL via `pg`; HTTP Basic auth. Specs map: auth→middleware, catalog→schema+lookups, ingest→normalize/canonicalize/seed, query→`GET /api/samples`, registration→`POST /api/samples`, export→`GET /api/samples/export`. `data/muestras.tsv` (99 rows, immutable) seeds Postgres; registrations append only.

## Architecture Decisions

| # | Decision | Choice | Alternatives | Rationale |
|---|----------|--------|--------------|-----------|
| D1 | Monorepo layout | Root package.json (pnpm), `src/` + `server/`, two tsconfigs; small duplicated contract types | pnpm workspaces; one tsconfig | NodeNext `.js` imports and Vite resolution differ — one tsconfig cannot serve both; workspaces are overkill for a demo |
| D2 | Schema shape | `samples` (id PK, 17 domain cols, unique `lower(CodigoMuestra)`) + `rock_types`/`collectors`/`analysis_types` (id, name, `normalized_key` UNIQUE); FKs RESTRICT; `SistemaCoordenadas`/`Proyecto` as constants via `GET /api/meta` | EAV; single denormalized table | Lookups give case/accent-insensitive identity; FKs enforce canonical refs; constants avoid repetition |
| D3 | Rock canonicalization | Curated alias map in `ingest/canonical.ts`: normalized form (trim, accent-fold, drop `?`) → canonical entry; unmatched values keep their normalized form; collectors same (`Pado`→`Pardo`); analysis: 4 canonicals (`DatacionesRadiometricas`→`Dataciones Radiometricas`) | ML clustering; editing the TSV | 58 raw strings — curated map is deterministic and testable; fallback satisfies "no record dropped"; seed under 57 |
| D4 | API + auth | `GET /api/samples` (filters, paginated, total), `GET /api/samples/:code` (404), `GET /api/samples/export` (CSV, no BOM), `POST /api/samples` (201/400/409), `GET /api/meta`; Basic middleware on POST (MUST); reads public (reversible via `AUTH_READS`) | Protect all routes | Registration auth is mandated; public reads keep the demo simple; fail-closed on empty `ADMIN_USERS`; identical 401 for user/password failure |
| D5 | Normalization pipeline | `ingest/normalize.ts` (trim, accent-fold, strip `?`, blank→NULL, `D/M/YYYY`→ISO) shared by ingest and registration; seed via `INSERT … ON CONFLICT DO NOTHING` | Separate paths | One code path = one test surface; ON CONFLICT guarantees idempotent reseed |
| D6 | Testing | vitest unit (normalizer, canonical, query builder, CSV formatter); supertest + mocked pg Pool; component tests (happy-dom + testing-library) | Live-DB tests | Mocked pool = deterministic CI without Postgres; mirrors SGC-MICRORESERVA |

## Data Flow

```
TSV ─► ingest/ (parse→normalize→canonicalize) ─┐
Registration ─► POST /api/samples ─────────────┤
SPA ─► GET /api/samples?filters ───────────────┴─► Postgres
SPA ◄─ GET /api/samples/export ─► CSV download
```

Registration sequence:

```
Browser        Express                       pg
  │ POST        │ auth 401 | validate 400    │
  │────────────►│ normalize                   │
  │             │ INSERT ON CONFLICT          │
  │             │───────────────────────────►│
  │◄────────────│ 201 | 409                   │
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json`, `.npmrc`, `vite.config.ts`, `tsconfig.json`, `server/tsconfig.json` | Create | pnpm scripts, Vite `/api` proxy→`:3001`, NodeNext strict |
| `schema.sql`, `server/src/ingest/seed.ts`, `.env.example`, `docker-compose.yml` | Create | DDL, idempotent seed, env, optional Postgres |
| `server/src/index.ts`, `config/db.ts`, `middlewares/auth.ts`, `routes/samples.ts`, `ingest/normalize.ts`, `ingest/canonical.ts`, `types.ts` | Create | Express entry (TZ first), pool, auth, routes, pipeline |
| `src/App.tsx`, `src/services/api.ts`, `src/components/` (FilterBar, SampleTable, RegistrationForm), `src/types.ts` | Create | SPA |
| `server/tests/*.test.ts`, `src/**/*.test.tsx` | Create | supertest + vitest suites |

## Interfaces / Contracts

```ts
type Sample = { id: number; igm: string|null; codigoMuestra: string; nombreEstacion: string;
  estacionCompanero: string|null; simboloUG: string|null; ugMapa: string|null;
  descripcionMuestra: string; nombreRoca: string; localizacion: string; plancha: string;
  norte: number|null; este: number|null; altura: number|null; fecha: string; // ISO
  nombreColector: string|null; existeMuestra: boolean|null; tipoAnalisis: string; }
type CanonicalEntry = { id: number; name: string; normalizedKey: string };
type SampleFilters = { code?; rock?; unit?; collector?; analysis?; plancha?; dateFrom?; dateTo?; q?; page?; pageSize? };
// GET /api/samples        → { data: Sample[], total, page, pageSize }
// GET /api/samples/:code  → Sample | 404
// GET /api/samples/export → text/csv; charset=utf-8 (no BOM)
// POST /api/samples       → 201 Sample | 400 | 409 | 401
// GET /api/meta           → { rockTypes, collectors, analysisTypes, constants }
```

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | normalizer, canonical resolver, query builder, CSV formatter | vitest |
| Integration | auth 401/fail-closed, registration 400/409/201, filters, export, seed idempotence | supertest + mocked pg Pool |
| Component | filter form, results table, registration errors | vitest + happy-dom + testing-library |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary; standard web CRUD app (git/DB ops are developer workflow, not product behavior).

## Migration / Rollout

Greenfield — no data migration. Rollout: `schema.sql` → `pnpm seed` (idempotent; TSV immutable). Postgres optional via docker-compose. Rollback: drop schema + reseed; auth toggle off via env flag; append-only prevents data loss. 400-line budget → chained PRs (ask-on-risk, per sdd-tasks).

## Open Questions

- [ ] Auth on reads? Default: public (`AUTH_READS`).
- [ ] `ExisteMuestra` raw semantics — confirm boolean mapping.
- [ ] EPSG:3115 unconfirmed — non-blocking (no bbox).