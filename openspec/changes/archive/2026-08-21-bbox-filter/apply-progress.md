# Apply Progress: bbox-filter

**Change**: bbox-filter  
**Mode**: Standard (Strict TDD NOT active)  
**Status**: 15/15 tasks complete. Ready for verify.

## Completed Tasks

- [x] 1.1 Add `norteMin/norteMax/esteMin/esteMax?: number` to `SampleFilters` in `server/src/types.ts`
- [x] 1.2 Mirror the same 4 fields in SPA `SampleFilters` (`src/types.ts`)
- [x] 2.1 Add local `num()` parseFloat parser in `parseFilters`; parse 4 bbox params to `number | undefined`
- [x] 2.2 Append 4 conditions at END of `buildWhere` (slots 9–12)
- [x] 2.3 Add `validateBbox()` returning `string | null`; call in `/samples` and `/export` before `buildWhere`
- [x] 2.4 `server/tests/pg-mock.ts`: extend `extractFilters` to 13 slots, add 4 `applyFilters` branches, add null-coord fixture
- [x] 3.1 Filtering: north range inclusive, single bound only, combined with rock, null-coord excluded
- [x] 3.2 Validation: inverted north → 400, inverted east → 400, equal bounds accepted
- [x] 3.3 Export: bbox limits CSV data rows; inverted box → 400
- [x] 4.1 `src/components/FilterBar.tsx`: 4 numeric inputs in fieldset sub-grid; submit serializes; clear resets
- [x] 4.2 `src/services/api.ts`: add 4 bbox entries to `toQuery`
- [x] 4.3 `src/components/FilterBar.test.tsx`: inputs render, submit serializes, empty omitted, clear resets
- [x] 4.4 `src/services/api.test.ts`: `toQuery` emits 4 bbox params, omits undefined
- [x] 5.1 Full suite green: `npm test`
- [x] 5.2 Build green: `npm run build`

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `server/src/types.ts` | Modified | Added 4 bbox fields to `SampleFilters` |
| `src/types.ts` | Modified | Mirrored 4 bbox fields in SPA `SampleFilters` |
| `server/src/routes/samples.ts` | Modified | `num()` parser, `validateBbox()`, appended 4 SQL conditions, wired validation into `/samples` and `/export` |
| `server/tests/pg-mock.ts` | Modified | 13-slot `extractFilters`, 4 bbox `applyFilters` branches, null-coord fixture on last row |
| `server/tests/api.test.ts` | Modified | Bbox range, single bound, combined rock+bbox, null-coord exclusion, inverted-box 400, equal bounds, CSV export scenarios |
| `src/components/FilterBar.tsx` | Modified | Fieldset sub-grid with 4 numeric inputs, state, submit serialization, clear reset |
| `src/services/api.ts` | Modified | 4 bbox entries in `toQuery` |
| `src/components/FilterBar.test.tsx` | Modified | Tests for render, serialize, empty omitted, clear reset |
| `src/services/api.test.ts` | Modified | Test for `toQuery` bbox serialization |

## Work Unit Evidence

### Unit 1: Backend bbox filter

| Evidence | Value |
|---|---|
| Focused test command | `npm run test:api` |
| Exact result | `✓ server/tests/api.test.ts (47 tests) 997ms` → 47 passed |
| Runtime harness | `npm run dev:server` → `curl 'localhost:3001/api/samples?norteMin=1010&norteMax=1005'` → 400 (manual smoke recorded per task 5.2) |
| Rollback boundary | Revert commit `51d4666` (`server/src/routes/samples.ts`, `server/src/types.ts`, `server/tests/pg-mock.ts`, `server/tests/api.test.ts`, `src/types.ts`); SPA untouched |

### Unit 2: SPA bbox inputs

| Evidence | Value |
|---|---|
| Focused test command | `npm run test:spa` |
| Exact result | `✓ src/... (30 tests)` → 30 passed |
| Runtime harness | `npm run dev` → submit FilterBar with norteMin/norteMax → params in URL (manual smoke recorded per task 5.2) |
| Rollback boundary | Revert commit `05d5cf5` (`src/components/FilterBar.tsx`, `src/services/api.ts`, plus their tests); backend stays functional |

## Test Results

| Command | Result |
|---|---|
| `npm run typecheck:server` | ✅ passed |
| `npm run test:api` | ✅ 47 passed |
| `npm run test:spa` | ✅ 30 passed |
| `npm test` | ✅ 104 passed (8 files) |
| `npm run build` | ✅ SPA typecheck + production build passed |

## Deviations from Design

1. **Removed the `!== ""` guard for bbox conditions in `buildWhere`.** The design showed `if (filters.norteMin !== undefined && filters.norteMin !== "")`, but `norteMin` is typed as `number | undefined` and the `num()` parser never returns `""`. TypeScript flagged the comparison as an error (TS2367). The guard was therefore reduced to `!== undefined`, which is semantically identical for this type.

2. **Null-coord fixture was applied to the last existing fixture instead of appending a new one.** The design said "add 1 null-coord fixture," but appending a 100th row would have forced updates to pagination, total-count, and CSV export assertions throughout the existing test suite. Setting `fixtures[fixtures.length - 1].norte = null; fixtures[fixtures.length - 1].este = null` achieves the same spec scenario (null coordinates excluded when bbox bound present) with zero disruption to existing tests.

## Issues Found

- None that affect correctness. One test-writing gotcha: React `type="number"` inputs with empty value report `null` (not `""`) via `@testing-library`'s `toHaveValue`, so the clear-reset test asserts `null`.

## Remaining Tasks

- None. Implementation is complete and the full suite is green.

## Workload / PR Boundary

- Mode: single PR
- Current work unit: both work units committed
- Boundary: commits `51d4666` (backend) and `05d5cf5` (SPA)
- Estimated review budget impact: ~325 changed lines across both commits, under the 400-line budget
