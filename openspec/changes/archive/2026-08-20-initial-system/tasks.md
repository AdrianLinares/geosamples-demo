# Tasks: Initial Geological-Sample System

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Est. changed lines | ~1800 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 ingest → PR2 api → PR3 spa |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | PR | Focused test | Runtime harness | Rollback |
|------|------|----|--------------|-----------------|----------|
| 1 | Schema + ingest + seed | 1 | `pnpm vitest run server/tests/ingest.test.ts server/tests/canonical.test.ts` | `docker compose up -d && pnpm seed` → 99 rows, rock<57 | `schema.sql`, `server/src/ingest/**`, `config/db.ts` |
| 2 | Auth + API + meta + entry | 2 | `pnpm vitest run server/tests/api.test.ts` | `pnpm dev:server`; `curl /api/samples` 200/99; POST no-auth 401 | `index.ts`, `middlewares/auth.ts`, `routes/samples.ts` |
| 3 | SPA + services + tests + docs | 3 | `pnpm vitest run src` | `pnpm dev`; filter rock+unit→rows; register admin | `src/**` |

Bases: PR#1→tracker; PR#2→PR#1; PR#3→PR#2.

## Phase 1: Foundation
- [x] 1.1 `package.json`: scripts dev/build/test/seed/dev:server; deps react,vite,express5,pg,bcryptjs,middleware; dev vitest,testing-library,supertest,ts.
- [x] 1.2 `tsconfig.json` (SPA bundler, strict) + `server/tsconfig.json` (NodeNext, `.js` imports).
- [x] 1.3 `vite.config.ts`: `/api` proxy→`:3001`; test env happy-dom.
- [x] 1.4 `.env.example`: `DATABASE_URL`, `ADMIN_USERS` (user:bcrypt), `PORT=3001`, `AUTH_READS=false`.
- [x] 1.5 `docker-compose.yml` + `schema.sql`: Postgres 16 (geosamples); `samples` (17 cols, `unique lower(CodigoMuestra)`); 3 lookup tables (`normalized_key` UNIQUE, FK RESTRICT); 4 analysis seeds.

## Phase 2: Core Backend
- [x] 2.1 `server/src/types.ts`: `Sample`, `CanonicalEntry`, `SampleFilters`, meta.
- [x] 2.2 `server/src/ingest/canonical.ts`: 58-rock map (`Pado`→`Pardo`), 4 analyses; fallback normalized.
- [x] 2.3 `server/src/ingest/normalize.ts`: trim, accent-fold, strip `?`, blank→null, `D/M/YYYY`→ISO.
- [x] 2.4 `server/src/config/db.ts`: `pg` Pool from `DATABASE_URL`.
- [x] 2.5 `server/src/ingest/seed.ts`: parse `data/muestras.tsv`, normalize→canonicalize, `ON CONFLICT DO NOTHING`; assert 99 rows, rock<57.
- [x] 2.6 `server/src/middlewares/auth.ts`: HTTP Basic; parse `ADMIN_USERS`; fail-closed; identical 401 `WWW-Authenticate: Basic`.
- [x] 2.7 `server/src/routes/samples.ts`: `GET /api/samples` (filters, paginate+total); `GET /:code` 404; `POST /api/samples` 400/409/201; `GET /export` CSV no-BOM; `GET /api/meta`.
- [x] 2.8 `server/src/index.ts`: `TZ=America/Bogota` BEFORE imports; helmet/cors/rate-limit; morgan/winston; mount; skip listen if test.

## Phase 3: Frontend SPA
- [x] 3.1 `src/types.ts` + `src/services/api.ts`: mirror types; Basic header (sessionStorage); getSamples/getSample/createSample/exportCSV/getMeta.
- [x] 3.2 `src/App.tsx`: shell + query↔admin registration; load meta.
- [x] 3.3 `src/components/FilterBar.tsx` + `SampleTable.tsx`: filters code,rock,unit,collector,analysis,plancha,dates,q; paginated + export button.
- [x] 3.4 `src/components/RegistrationForm.tsx`: admin form, Basic prompt, validation errors.

## Phase 4: Tests
- [x] 4.1 `server/tests/ingest.test.ts` + `canonical.test.ts`: `3/11/2019`→`2019-11-03`; `Ultracataclasita ?`→stripped; blank→null; blank companion null; 58 raw→canonical; `Cortés`/`Cortes`; `datacionesradiometricas`→`Dataciones Radiometricas`; 99 rows; rock<57.
- [x] 4.2 `server/tests/api.test.ts` (mocked pg): 401 identical; POST 400/409/201; filters + case-insensitive code + `Tafoni`; pagination 25/25/25/24; export no-BOM (5 rows, 40 ignores page, header-only empty); `/:code` 404; meta 4 analyses.
- [x] 4.3 `src/**/*.test.tsx`: FilterBar inputs; SampleTable rows+pagination; RegistrationForm 400 errors.

## Phase 5: Cleanup / Docs
- [x] 5.1 `README.md`: quickstart (compose, install, seed, dev).
- [x] 5.2 Seed assert: 99 rows, rock<57, no drop. (assert implemented in seed.ts; live DB run DONE 2026-08-20 on local PG: 99 rows, 42 rocks, 12 collectors, 4 analyses, idempotent second run — see apply-progress)
