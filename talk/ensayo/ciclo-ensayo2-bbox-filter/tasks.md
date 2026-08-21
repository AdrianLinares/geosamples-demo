# Tasks: Geographic Bounding-Box Filter (bbox-filter)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200–240 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Server bbox filter: types, route, pg-mock sync, API tests | PR 1 (single) | `pnpm test:api` | supertest app in `api.test.ts`; optional curl against `pnpm dev:server` | Revert `server/src` + `server/tests`; SPA bbox params then ignored as unknown query params |
| 2 | SPA bbox inputs: type mirror, `toQuery`, FilterBar, tests | PR 1 (single) | `pnpm test:spa` | happy-dom tests; optional `pnpm dev` manual pass | Revert `src/`; API already tolerates unknown bbox params |

## Phase 1: Foundation — Shared Types

- [x] 1.1 `server/src/types.ts`: add `norteMin?/norteMax?/esteMin?/esteMax?: number` to `SampleFilters`.
- [x] 1.2 `src/types.ts`: mirror the same 4 fields identically (server/SPA contract must not drift).

## Phase 2: Server Core — `server/src/routes/samples.ts`

- [x] 2.1 `parseFilters`: add `float` helper (`Number.parseFloat`; NaN/Infinity → `undefined`) and parse the 4 bbox params.
- [x] 2.2 `GET /samples` handler: when both bounds of an axis are present and min > max, return 400 with an error naming the axis (norte, este).
- [x] 2.3 `buildWhere`: append `s.norte >= $N`, `s.norte <= $N`, `s.este >= $N`, `s.este <= $N` LAST (after `q`); update the fixed-order comment.

## Phase 3: Server Tests — mock sync + spec scenarios

- [x] 3.1 `server/tests/pg-mock.ts` `extractFilters`: 9→13 slots; add 4 grabs (`s.norte >=`, `s.norte <=`, `s.este >=`, `s.este <=`).
- [x] 3.2 `applyFilters`: add 4 numeric range filters with explicit null guards (JS `null <= x` is true — unlike SQL NULL semantics).
- [x] 3.3 Fixture: make one row's `norte`/`este` null for scenario 5 (first verify no existing assertion depends on that row).
- [x] 3.4 `api.test.ts`: full box `norteMin=1020&norteMax=1050&esteMin=2020&esteMax=2050` → total 31; boundary rows included (scenario 1).
- [x] 3.5 `api.test.ts`: partial bounds (norte only → no este constraint) and no bbox → total 99, geographically unconstrained (scenarios 2–3).
- [x] 3.6 `api.test.ts`: inverted norte and este bounds → 400 with axis-named error; out-of-range box → 0 rows (scenario 4).
- [x] 3.7 `api.test.ts`: NULL-coordinate row absent from bbox results but present unfiltered (scenario 5).

## Phase 4: SPA — FilterBar wiring

- [x] 4.1 `src/services/api.ts`: add the 4 bbox keys to `toQuery` entries.
- [x] 4.2 `FilterBar.tsx`: 4 `useState` + grouped "Bounding Box" numeric inputs; submit maps empty → `undefined`; clear resets all.
- [x] 4.3 `FilterBar.test.tsx`: assert `onSearch` receives the 4 numeric bbox fields on submit and `{}` on clear.

## Phase 5: Verification

- [x] 5.1 `pnpm test` full suite green (regression for the existing 9 filters).
- [x] 5.2 `tsc --noEmit` (root) + `pnpm typecheck:server` — proves `SampleFilters` sync.
- [x] 5.3 Trace the 5 spec scenarios to tests 3.4–3.7; confirm none uncovered.
