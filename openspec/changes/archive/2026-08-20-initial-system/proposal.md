# Proposal: Initial Geological-Sample System (initial-system)

## Intent

Greenfield full-stack geological-sample registration and query system (INVEMAR, 99 records). Repo holds only `data/muestras.tsv`: 57 rock variants, collector typos, non-padded dates. Deliver Postgres-backed system for the agentic-development talk, mirroring SGC-MICRORESERVA.

## Scope

### In Scope
- Stack: React 19/Vite 6/TS SPA; Express 5/TS; PostgreSQL
- TSV ingest: normalize (case, accents, `?`, dates) into canonical lookup tables (rock types, collectors, analysis types); seed
- Query API and UI: filters (code, rock, unit, collector, analysis, plancha, dates) and CSV export
- Admin-only HTTP Basic auth (`ADMIN_USERS`/bcryptjs); registration (append-only); tests: Vitest, happy-dom, testing-library, supertest

### Out of Scope
- bbox search (deferred; EPSG:3115 unconfirmed); PDF export; edit and delete
- `SubUnidad` (empty); `SistemaCoordenadas`/`Proyecto` metadata

## Capabilities

Contract for sdd-spec; all new.

### New Capabilities
- `admin-auth`: HTTP Basic auth on sample endpoints
- `sample-catalog`: schema: `samples` + `rock_types`, `collectors`, `analysis_types`
- `sample-ingest`: TSV parse, normalize, canonicalize, seed
- `sample-query`: read API, filters, free text
- `sample-registration`: authenticated create, validation, append-only
- `csv-export`: filtered results as CSV

### Modified Capabilities
None.

## Approach

Mirror SGC-MICRORESERVA. Backend: `server/src/index.ts` sets `TZ=America/Bogota` before imports; helmet/cors/rate-limit; morgan/winston; NodeNext with `.js` imports. Frontend: Vite proxy `/api` to `:3001`. `schema.sql` and seed load data; registrations append. High effort exceeds the 400-line review budget: chained PRs (`ask-on-risk`, surfaced in sdd-tasks).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| Root config | New | `package.json`, `.npmrc`, `vite.config.ts`, tsconfigs: pnpm, NodeNext |
| `src/` | New | SPA: query UI, form, `src/services/api.ts` |
| `server/src/` | New | Express entry, `auth.ts`, `samples.ts`, `ingest/` |
| `schema.sql`, `.env.example` | New | DB schema, seed; env vars |
| Tests; `data/muestras.tsv` | New; Reference | supertest, component tests; immutable seed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Postgres unavailable | Med | docker-compose; mock pool |
| Canonicalization wrong | Med | Unit-test normalizer and seed |
| `.js`-import/TZ violations | Med | Design rules; typecheck |
| 400-line review budget | High | Chained PRs |
| Secrets leaked | Low | `.env` gitignored |

## Rollback Plan

- Pre-release: drop schema, reseed from `data/muestras.tsv`.
- Post-merge: `git revert` per PR; append-only prevents data loss.
- Auth: toggle middleware off via env flag.

## Dependencies

- PostgreSQL (local/Docker); pnpm
- `ADMIN_USERS` bcrypt hashes; SGC-MICRORESERVA manifests as reference

## Success Criteria

- [ ] 99 records seed; canonical rock set under 57 variants
- [ ] Query UI and API filter every dimension
- [ ] Registration persists append-only; unauthenticated gets 401
- [ ] CSV export matches filtered view
- [ ] `pnpm test` and `tsc --noEmit` green
- [ ] Register-to-query demo runs
