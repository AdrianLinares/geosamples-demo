# Exploration: initial-system (Geological-Sample Registration & Query)

**Change**: `initial-system`
**Project**: `geosamples-demo`
**Artifact store mode**: hybrid (OpenSpec file + Engram observation)
**Investigated asset**: `data/muestras.tsv` (real, 99 records + header, 20 columns, UTF-8, no trailing newline). No application code exists yet; repo is a fresh git init with zero commits.
**Stack decision**: ADOPTED — full mirror of `SGC-MICRORESERVA` (React 19 + Vite 6 + TS SPA, Express 5 + TS backend, PostgreSQL via `pg`). Verified against that project's `package.json`, `AGENTS.md`, and both `tsconfig.json` files.

---

## Current State

The repository contains **no application code**. The single real asset is `data/muestras.tsv`, a georeferenced inventory of geological samples collected in the Santa Marta region (Colombia) by INVEMAR researchers between 2019 and 2022. All 99 rows are complete enough to define a domain model, but the file carries significant quality debt (see Data Analysis). There is no stack, no test runner, and no persistence layer — now resolved: `initial-system` will mirror the `SGC-MICRORESERVA` petrography-room system (same geological domain), giving a concrete, demo-grade full-stack target for the downstream SDD phases (propose → spec → design → tasks → apply → verify → archive).

---

## Data Analysis

Columns (20) and their observed quality, derived by parsing all 99 rows:

| # | Column | Empty | Notes / Quality issues |
|---|--------|-------|------------------------|
| 1 | `IGM` | 7/99 | Lab/inventory ID; blank on the same 7 rows that lack geological-unit codes. |
| 2 | `CodigoMuestra` | 0/99 | Unique key, **no duplicates**. Mixed-case suffixes (`ACM0398p` vs `ACM0410P` vs `ACM0397A`) → needs case-insensitive lookup. |
| 3 | `NombreEstacion` | 0/99 | Station name; often shares prefix with `CodigoMuestra`. Clean. |
| 4 | `EstacionCompanero` | 19/99 | Companion station; ~19% missing. |
| 5 | `SimboloUG` | 7/99 | Geological-unit symbol; contains `?` uncertainty placeholders (`e3?e4bsm`). 13 distinct symbols. |
| 6 | `UGMapa` | 7/99 | Geological-unit name; 13 clean distinct values (e.g. `Batolito de Santa Marta` ×44, `Esquistos del Gaira` ×11). Good filter dimension. |
| 7 | `SubUnidad` | **99/99** | **100% empty.** Dead column — drop from the schema (do not model as a column/filter). |
| 8 | `DescripcionMuestra` | 0/99 | Free-text Spanish field descriptions; ideal for full-text search (Postgres `tsvector` or `ILIKE`). |
| 9 | `NombreRoca` | 0/99 | **57 raw variants**; severe casing/typo/synonym noise: `Cuarzodiorita` (24) vs `cuarzodiorita` (5) vs `Roca ígnea, cuarzodiorita` (4); `Esquisto` vs `esquisto`; `?` marks uncertainty (`neis?`, `Ultracataclasita ?`). Needs a canonical rock-type taxonomy (lookup/enum). |
| 10 | `Localizacion` | 0/99 | Place description; 7 cells literally `No reporta` (no specific locality). |
| 11 | `Plancha` | 0/99 | Colombian topographic sheet code; 13 distinct (`11IVD` ×49, `18IVB` ×12, …). Good filter dimension. |
| 12 | `Norte` | 0/99 | Numeric 99/99; range 1,001,361–1,744,707 (MAGNA Colombia Bogotá projected Y, meters). |
| 13 | `Este` | 0/99 | Numeric 99/99; range 728,484–1,001,857 (projected X, meters). |
| 14 | `Altura` | 1/99 | Elevation (m); numeric 98/99, range 1–1450. One blank. |
| 15 | `SistemaCoordenadas` | 0/99 | **Constant** = `Magna Colombia Bogotá` for all 99 rows. Metadata, not a filter (store once, e.g. as a column default / constant). |
| 16 | `Fecha` | 0/99 | Format `D/M/YYYY`, **non-zero-padded** (`3/11/2019`, `17/9/2021`). Parse via `%d/%m/%Y`, normalize to `DATE` / ISO for range queries. |
| 17 | `Proyecto` | 0/99 | **Constant** = `Investigación Maritima, Costera e Insular` for all 99 rows. Metadata, not a filter. |
| 18 | `NombreColector` | **32/99** | Collector; 32% missing. Plus typos/order variants: `Germán Pardo Torres` vs `Germán Pado Torres` (typo), `Ana Milena Cardozo Ortiz _ Viviana Monsalve` (`_` separator), `Alejandro Patiño Elizabeth Cortes` vs `Elizabeth Cortes Alejandro Patiño` (swapped order), `Cortés` vs `Cortes` (accent). Needs canonicalization (lookup table). |
| 19 | `ExisteMuestra` | **98/99** | Only 1 row has `Si` (APN0720P). Effectively non-functional as a flag; keep as nullable `boolean`, not a filter. |
| 20 | `TipoAnalisis` | 0/99 | 4 values: `Seccion Delgada` (69), `DatacionesRadiometricas` (18), `Analisis Macro` (10), `Bioestratigrafia` (2). Mixed capitalization; canonicalize to title-case enum for display/filter. Good filter dimension. |

### Key data-quality findings
- **Dead/constant columns**: `SubUnidad` (empty), `SistemaCoordenadas` & `Proyecto` (constant) add no query value — drop `SubUnidad`, treat the constants as metadata.
- **Sparse-but-useful**: `ExisteMuestra` (98% empty) and `EstacionCompanero` (19% empty) and `NombreColector` (32% empty) are real but unreliable — model as nullable, don't present as guaranteed filters.
- **Normalization hotspots**: `NombreRoca` (57 raw → small canonical set) and `NombreColector` (typos + 32 blanks) are the two fields requiring explicit canonicalization rules in the design (lookup tables seeded at ingest).
- **Coordinates are consistent**: `Norte`/`Este`/`Altura` are fully numeric and usable for bounding-box / elevation queries once CRS is fixed as MAGNA Colombia Bogotá (EPSG:3115).
- **Dates need normalization**: non-padded `D/M/YYYY` → ISO `YYYY-MM-DD` for sorting/range filters.

---

## Domain Understanding

A **registration and query system** for this data means two capabilities, now expressed over Postgres + a web UI:

1. **Query** — retrieve samples by any combination of:
   - Exact / prefix / case-insensitive `CodigoMuestra` or `NombreEstacion`
   - Rock type (`NombreRoca`, canonicalized) and geological unit (`UGMapa`, `SimboloUG`)
   - Collector (`NombreColector`, canonicalized) and companion station
   - Analysis type (`TipoAnalisis`) and topographic sheet (`Plancha`)
   - Date range (`Fecha`)
   - Geographic bounding box / elevation band (`Norte`, `Este`, `Altura`)
   - Free-text search over `DescripcionMuestra` and `Localizacion`
2. **Registration** — add a new sample with validation (required fields, coordinate sanity, canonicalized enums) via an authenticated endpoint, persisted to Postgres.

The most valuable engineering content for the SDD pipeline is the **normalization/ingestion layer** (messy TSV → clean, typed, queryable Postgres rows), plus the query API + UI. Those are where real design decisions and the highest-value tests live.

---

## Affected Areas

No existing code is touched (read-only exploration). Proposed modules the next phases should create (mirroring `SGC-MICRORESERVA`):

- `package.json` (root, pnpm) + `pnpm-lock.yaml` + `.npmrc` (mirror `ignore-builds` allowlist) — single install at root.
- `vite.config.ts` — `@vitejs/plugin-react`, `/api` proxy → `localhost:3001` in dev, `happy-dom` test env, single root Vitest config.
- `tsconfig.json` (root, frontend: `bundler`, `noEmit`, `jsx: react-jsx`) + `server/tsconfig.json` (backend: `NodeNext`, `strict`, `outDir: server/dist`). **Backend imports MUST use `.js` extensions.**
- `index.html` + `src/` — React 19 + TypeScript SPA, Tailwind 3.4, lucide-react. Query UI components + `src/services/api.ts` calling `/api/...`.
- `server/src/index.ts` — Express 5 entrypoint. Sets `process.env.TZ = 'America/Bogota'` **before** importing db/logger/routes; helmet + cors + express-rate-limit; morgan + winston; mounts sample routes; skips `app.listen` when `NODE_ENV === 'test'`.
- `server/src/config/db.ts` — `pg` pool from `DATABASE_URL` (calls `dotenv.config()` itself). `server/src/config/logger.ts` (winston).
- `server/src/middlewares/auth.ts` — `adminAuthMiddleware` (HTTP Basic + bcryptjs, `ADMIN_USERS` JSON array).
- `server/src/routes/samples.ts` + service/repo — query + registration endpoints; delegates to `server/src/ingest/` normalizer.
- `server/src/ingest/` — TSV parser + normalizer (casing, `?` handling, ISO dates, collector/rock canonicalization, dead-column drop).
- `schema.sql` — `samples` table (typed columns) + canonical lookup tables (`rock_types`, `collectors`, `analysis_types`); seed script loads normalized `muestras.tsv`.
- `.env.example` (`DATABASE_URL`, `ADMIN_USERS`, `PORT`) — `.env`/`.env.local` gitignored; secrets never committed.
- `server/tests/` — supertest tests (mock `../src/config/db.js` with `.js` path, set env before import). `src/**/*.test.tsx` — happy-dom + @testing-library/react.
- `data/muestras.tsv` — immutable reference dataset (read-only source for seeding).

---

## Approaches

| # | Approach | Pros | Cons | Effort |
|---|----------|------|------|--------|
| 1 | **Full mirror of SGC-MICRORESERVA (ADOPTED)** — React 19 + Vite 6 + TS SPA (Tailwind 3.4, lucide-react); Express 5 + TS backend (`NodeNext`/`strict`, `.js` imports, `server/dist`); PostgreSQL via `pg` (`schema.sql`, `DATABASE_URL`); Basic+bcryptjs auth; helmet/cors/rate-limit; morgan/winston; Vitest 4 + happy-dom + @testing-library/react + supertest; pnpm; TZ `America/Bogota`. | Real, demo-grade full-stack system in the SAME geological domain; faithful mirror shortens design (proven patterns); strong typed domain model; convincing live UI for the talk; Postgres enables real SQL filtering/ranges/text search; test strategy already defined by the source project. | Heaviest surface — will exceed the 400-line review budget across the change (chained PRs likely); requires a running Postgres (local/Docker) for dev + verify; two tsconfigs + `.js`-import rule easy to violate; pnpm + native-build allowlist install friction; auth/env secrets to manage. | **High** |
| 2 | *(Rejected alternative)* Python 3 stdlib-only CLI | Zero deps, smallest surface, fastest to build. | No web UI; does not match the talk's real-world demonstration or the user's directive to mirror SGC-MICRORESERVA. | Low |
| 3 | *(Rejected alternative)* FastAPI + vanilla-JS | Real UI, few deps. | Diverges from the mandated React/Express/Postgres mirror; loses the proven SGC patterns. | Medium |

### Recommendation

**Adopt Approach 1 — the full SGC-MICRORESERVA mirror (React 19 + Vite 6 + TS / Express 5 + TS / PostgreSQL).** Rationale:

- The user explicitly directed the stack to mirror the real petrography-room system in the same geological domain; the manifests (`package.json`, `AGENTS.md`, both `tsconfig.json`) confirm every detail, so design can reuse proven, verified patterns instead of inventing them.
- A real full-stack system with a query UI is the most convincing artifact for an agentic-development talk, and Postgres makes the rich filtering (ranges, bbox, free-text) straightforward via SQL.
- The data-normalization and query logic is where tests pay off; Vitest + supertest (with the `.js`-import mock pattern) give a ready-made, high-value test strategy.
- **Consequence to manage**: this is a High-effort change that will blow the 400-line review budget — `sdd-tasks` MUST forecast `400-line budget risk: High` and recommend chained PRs (deliverable work units: schema+seed → backend API → frontend UI → tests), under the cached `ask-on-risk` delivery strategy.

---

## Risks

- **Postgres availability**: dev and `verify` need a running Postgres (`DATABASE_URL`); add a `docker-compose.yml` / local-PG setup note and a seed script. Mitigate by making `verify` boot a throwaway DB or use a mock pool in tests.
- **Data-quality debt persists**: `NombreRoca` (57 variants) and `NombreColector` (typos + 32 blanks) still need canonicalization lookup tables + seed rules; wrong rules silently break filtering. Unit-test the normalizer and the seed.
- **Dead/constant columns** (`SubUnidad`, `SistemaCoordenadas`, `Proyecto`) — don't model `SubUnidad`; treat constants as metadata, not filters.
- **`ExisteMuestra` near-empty** — model as nullable `boolean`, never present as a working filter.
- **Coordinate CRS assumption**: `Norte`/`Este` as MAGNA Colombia Bogotá (EPSG:3115) is inferred; confirm before enabling geographic search.
- **Two tsconfigs + `.js` imports**: backend source AND test imports MUST use `.js` extensions (e.g. `import app from '../src/index.js'`, `vi.mock('../src/config/db.js')`). Forgetting this breaks compile + tests — enforce in design rules.
- **TZ ordering gotcha**: `server/src/index.ts` must set `TZ = 'America/Bogota'` before importing db/logger/routes (mirror SGC exactly).
- **Auth/secrets**: `ADMIN_USERS` JSON + bcrypt hashes; `.env`/`.env.local` gitignored, `.env.example` tracked; never commit secrets.
- **Review budget**: High effort → chained PRs required under `ask-on-risk`; `strict_tdd` is currently `false` but Vitest will be introduced, so `sdd-design`/`sdd-tasks` should define `test_command` and consider enabling TDD.

---

## Ready for Proposal

**Yes.** The exploration is sufficient to proceed to `sdd-propose`. The orchestrator should tell the user:
1. Stack is **locked**: full SGC-MICRORESERVA mirror (React 19 + Vite 6 + TS SPA / Express 5 + TS backend / PostgreSQL via `pg`), verified against that project's manifests.
2. Two fields (`NombreRoca`, `NombreColector`) require **canonicalization lookup tables** — ask the user for the preferred canonical rock-type taxonomy and collector list, or let the design phase propose sensible defaults and confirm later.
3. `SubUnidad` dropped; `SistemaCoordenadas`/`Proyecto` as metadata; `ExisteMuestra` nullable boolean; `TipoAnalisis` as a 4-value enum.
4. Persistence is **Postgres** (`schema.sql` + seed from `data/muestras.tsv`); registrations go through an authenticated endpoint. Need a local/Docker PG for dev+verify.
5. `sdd-tasks` MUST flag **400-line budget risk: High** and plan **chained PRs**.
