# Tasks: Geographic Bounding-Box Filter (bbox-filter)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250 (220–280) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR (2 work-unit commits) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending (not needed — under budget) |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Backend bbox: types, parse/where, validation, pg-mock, API tests | PR 1 | `npm run test:api` | `npm run dev:server` → `curl 'localhost:3001/api/samples?norteMin=1010&norteMax=1005'` → 400 | Revert commit 1 (samples.ts, server types.ts, pg-mock.ts, api.test.ts); SPA untouched |
| 2 | SPA bbox: FilterBar inputs, toQuery, SPA tests | PR 1 | `npm run test:spa` | `npm run dev` → submit FilterBar with norteMin/norteMax → params in URL | Revert commit 2 (FilterBar.tsx, api.ts, SPA tests); backend stays functional |

## Phase 1: Foundation (Types)

- [x] 1.1 Add `norteMin/norteMax/esteMin/esteMax?: number` to `SampleFilters` in `server/src/types.ts`. Verify: `npx tsc --noEmit`. Deps: none.
- [x] 1.2 Mirror the same 4 fields in SPA `SampleFilters` (`src/types.ts`). Deps: none.

## Phase 2: Backend Core (`server/src/routes/samples.ts`)

- [x] 2.1 Add local `num()` parseFloat parser in `parseFilters`; parse 4 bbox params to `number | undefined` (absent → no condition). Deps: 1.1.
- [x] 2.2 Append 4 conditions at END of `buildWhere` (slots 9–12): `s.norte >= $N`, `s.norte <= $N`, `s.este >= $N`, `s.este <= $N`; only when bound present. Deps: 2.1.
- [x] 2.3 Add `validateBbox()` returning `string | null`; call in `/samples` and `/export` before `buildWhere` → `res.status(400).json({ error })` on min>max. Deps: 2.1.
- [x] 2.4 `server/tests/pg-mock.ts`: extend `extractFilters` to 13 slots, add 4 `applyFilters` branches with `!== null` guards, add 1 null-coord fixture. Deps: 2.2.

## Phase 3: Backend Tests (`server/tests/api.test.ts`)

- [x] 3.1 Filtering: north range inclusive, single bound only, combined with rock, null-coord excluded (Bounding-Box Filter scenarios). Deps: 2.4.
- [x] 3.2 Validation: inverted north → 400, inverted east → 400, equal bounds accepted (Inverted-Box Validation scenarios). Deps: 2.3.
- [x] 3.3 Export: bbox limits CSV data rows; inverted box → 400 (CSV Export scenarios). Deps: 2.3, 2.4.

## Phase 4: SPA (`src/`)

- [x] 4.1 `src/components/FilterBar.tsx`: 4 useState + numeric inputs in fieldset sub-grid (`md:col-span-4`); submit serializes (empty→undefined); clear resets. Deps: 1.2.
- [x] 4.2 `src/services/api.ts`: add 4 bbox entries to `toQuery` entries array. Deps: 1.2.
- [x] 4.3 `src/components/FilterBar.test.tsx`: inputs render; submit serializes; empty omitted; clear resets (FilterBar scenarios). Deps: 4.1.
- [x] 4.4 `src/services/api.test.ts`: `toQuery` emits 4 bbox params, omits undefined. Deps: 4.2.

## Phase 5: Regression

- [x] 5.1 Full suite green: `npm test` (SPA + server workspaces). Deps: all above.
- [x] 5.2 Manual smoke: `npm run dev:server` + `npm run dev`; bbox query returns subset, inverted box → 400. Deps: 5.1.
