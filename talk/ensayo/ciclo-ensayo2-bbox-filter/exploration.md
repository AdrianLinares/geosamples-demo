# Exploration: bbox-filter

## Current State

The sample query API (`GET /api/samples`) supports 9 textual/date filters via a fixed-order `buildWhere` builder in `server/src/routes/samples.ts`. The SPA `FilterBar` mirrors these 9 fields with individual `useState` hooks and a submit/clear pattern. Coordinates (`norte`, `este`) are modeled as nullable `DOUBLE PRECISION` columns but have no filter support yet.

## Affected Areas

- `server/src/routes/samples.ts` — `buildWhere` (lines 93-135), `parseFilters` (lines 140-161), `SampleFilters` import from `../types.js`
- `server/src/types.ts` — `SampleFilters` type definition (lines 30-42)
- `src/types.ts` — SPA mirror of `SampleFilters` (lines 30-42)
- `src/services/api.ts` — `toQuery` function (lines 39-61) builds URLSearchParams from filters
- `src/components/FilterBar.tsx` — 9 field states, `handleSubmit`, `handleClear`
- `src/components/FilterBar.test.tsx` — filter submission and clear assertions
- `server/tests/api.test.ts` — filter test cases
- `server/tests/pg-mock.ts` — `extractFilters` (lines 98-120) and `applyFilters` (lines 122-150) rely on fixed 9-slot order
- `openspec/specs/sample-query/spec.md` — "Dimension Filters" requirement lists current filters
- `openspec/specs/sample-catalog/spec.md` — documents `Norte`/`Este` as numeric nullable (no change needed to model)

## Current buildWhere Pattern

**Location**: `server/src/routes/samples.ts:93-135`

**Signature**: `function buildWhere(filters: SampleFilters): { conditions: string[]; params: unknown[] }`

**Pattern**:
1. Initialize empty `conditions` array and `params` array
2. For each filter field, check `!== undefined && !== ""`
3. If present, push the value to `params`, then push a SQL condition using `$${params.length}` placeholder
4. Return both arrays; caller joins conditions with ` AND ` and prepends ` WHERE `

**Fixed order** (critical — the mock pool relies on this):
1. `code` → `lower(s.codigo_muestra) = lower($N)`
2. `rock` → `r.normalized_key = $N`
3. `unit` → `(s.ug_mapa ILIKE $N OR s.simbolo_ug ILIKE $N)` with `escapeLike`
4. `collector` → `c.normalized_key = $N`
5. `analysis` → `a.normalized_key = $N`
6. `plancha` → `s.plancha ILIKE $N` with `escapeLike`
7. `dateFrom` → `s.fecha >= $N`
8. `dateTo` → `s.fecha <= $N`
9. `q` → `(s.descripcion_muestra ILIKE $N OR s.localizacion ILIKE $N)` with `escapeLike`

**Edge cases handled**:
- Empty strings are treated as "no filter" (converted to `undefined` by `parseFilters` or skipped by the guard)
- `escapeLike` escapes `\`, `%`, `_` for ILIKE patterns
- `normalizeKey` folds accents and lowercases for canonical lookups
- All values are parameterized (no SQL injection risk)

**parseFilters** (lines 140-161): extracts string params with `str()` helper, int params with `int()` helper (uses `Number.parseInt`, returns `undefined` on NaN).

## Coordinate Model

**Schema** (`schema.sql:38-39`):
```sql
norte  DOUBLE PRECISION,
este   DOUBLE PRECISION,
```
Both are **nullable**.

**Semantics**: UTM coordinates in the "Magna Colombia Bogotá" system (confirmed by `constants.sistemaCoordenadas` in `/api/meta` response).

**Real data ranges** (from `data/muestras.tsv`, 99 rows):
- `norte`: ~1,001,361 to ~1,744,707 meters (UTM northing)
- `este`: ~728,484 to ~1,001,857 meters (UTM easting)

**Mock fixture ranges** (`server/tests/pg-mock.ts:68-69`):
- `norte`: 1000 + i → 1000..1098
- `este`: 2000 + i → 2000..2098

**TypeScript types** (`server/src/types.ts:15-16`, `src/types.ts:15-16`):
```typescript
norte: number | null;
este: number | null;
```

**Recommended validation rules for bbox params**:
- All four params (`norteMin`, `norteMax`, `esteMin`, `esteMax`) are **optional** (omitted = no filter on that axis)
- Each must parse as a finite number (reject NaN, Infinity)
- If both `norteMin` and `norteMax` are present, enforce `norteMin <= norteMax` (else return 400 or empty result)
- If both `esteMin` and `esteMax` are present, enforce `esteMin <= esteMax`
- Partial bounds (e.g., only `norteMin` given) SHOULD be allowed — treated as open-ended on that side
- Nullable coordinates: samples with `norte IS NULL` or `este IS NULL` should NOT match any bbox filter (SQL `norte >= $N` naturally excludes NULLs)

## SPA FilterBar Pattern

**Location**: `src/components/FilterBar.tsx`

**Current fields** (9 total):
1. `code` — text input, placeholder "p. ej. ACM0398p"
2. `rock` — select from `rockTypes` catalog
3. `unit` — text input, placeholder "p. ej. Batolito de Santa Marta"
4. `collector` — select from `collectors` catalog
5. `analysis` — select from `analysisTypes` catalog
6. `plancha` — text input, placeholder "p. ej. 11IVC"
7. `dateFrom` — date input
8. `dateTo` — date input
9. `q` — text input (col-span-3), placeholder "La descripción o la localidad contiene…"

**State management**: 9 individual `useState` hooks, each initialized from `filters.<field> ?? ""`

**Submit flow** (`handleSubmit`, lines 35-48):
- Prevents default form submission
- Builds a `SampleFilters` object, converting empty strings to `undefined`
- Calls `onSearch(filters)`

**Clear flow** (`handleClear`, lines 50-61):
- Resets all 9 state variables to `""`
- Calls `onSearch({})`

**Layout**: CSS grid, `grid-cols-1 md:grid-cols-4`, with `q` spanning 3 columns and buttons in the last cell.

**Test style** (`src/components/FilterBar.test.tsx`):
- Uses `@testing-library/react` + `userEvent`
- Renders with mock catalog data (`ROCKS`, `COLLECTORS`, `ANALYSES`)
- Asserts `onSearch` is called with expected filters via `expect.objectContaining`
- Tests clear behavior by asserting `onSearch` is called with `{}`
- Tests catalog options are present in selects

## Existing Specs Affected

### sample-query/spec.md

**Current "Dimension Filters" requirement** (lines 9-23):
> The system MUST support filtering by: sample code (`CodigoMuestra`), rock type, geological unit (`UGMapa` or `SimboloUG`), collector, analysis type, topographic sheet (`Plancha`), and date range (`Fecha`).

**Delta needed**: Add a new requirement "Geographic Bounding Box Filter" specifying:
- The system MUST support filtering by a geographic bounding box defined by `norteMin`, `norteMax`, `esteMin`, `esteMax`
- The filter MUST match samples where `norte` is within `[norteMin, norteMax]` AND `este` is within `[esteMin, esteMax]`
- All four params are optional; omitted params mean no constraint on that axis
- Samples with NULL coordinates MUST NOT match any bbox filter
- Invalid bounds (min > max) MUST return an empty result or a 400 error

**Scenarios to add**:
1. Bbox filter narrows results to samples within the box
2. Partial bbox (only norteMin/norteMax) filters on norte axis only
3. Empty bbox (no params) returns all samples
4. Inverted bounds (norteMin > norteMax) returns empty or 400
5. Samples with NULL coordinates are excluded from bbox results

### sample-catalog/spec.md

**No change needed** — the `Norte`/`Este` fields are already documented as "numeric, nullable" (line 25). The bbox filter is a query concern, not a model concern.

## Test Fixtures

**API tests** (`server/tests/api.test.ts`):
- Mock fixtures have `norte: 1000 + i`, `este: 2000 + i` for i in 0..98
- Suggested test cases:
  - `norteMin=1020&norteMax=1050&esteMin=2020&esteMax=2050` → should match samples 20..50 (31 samples)
  - `norteMin=1000&norteMax=1010` → should match samples 0..10 (11 samples)
  - `esteMin=2090&esteMax=2098` → should match samples 90..98 (9 samples)
  - `norteMin=5000&norteMax=6000` → should match 0 samples (out of range)
  - `norteMin=1050&norteMax=1020` → inverted bounds, should return 0 or 400

**SPA tests** (`src/components/FilterBar.test.tsx`):
- Add inputs for the 4 bbox fields
- Test that typing values and submitting includes them in the `onSearch` call
- Test that clearing resets them to empty

## Risks / Edge Cases

1. **Inverted bounds** (min > max): Should return empty result or 400. Recommendation: return empty result (consistent with "no matches" semantics of other filters).

2. **Partial bounds** (only some of the 4 given): Should apply only the given constraints. E.g., `norteMin=1050` alone means `norte >= 1050` with no upper bound.

3. **Non-numeric input**: Should be rejected (400) or ignored (treated as omitted). Recommendation: reject with 400 to surface user errors.

4. **Nullable coordinates**: Samples with `norte IS NULL` or `este IS NULL` will naturally be excluded by SQL comparison operators (`>=`, `<=`). No special handling needed.

5. **SQL injection**: Already mitigated by parameterized queries. The new bbox params will follow the same pattern.

6. **Mock pool order dependency**: `pg-mock.ts:extractFilters` uses regex to extract params by placeholder number from the SQL. Adding 4 new bbox conditions will shift the placeholder numbers. The mock must be updated to recognize the new bbox patterns and map them to the correct filter slots.

7. **SPA toQuery function**: Must add the 4 new keys to the `entries` array in `src/services/api.ts:41-53`.

8. **TypeScript type sync**: `SampleFilters` must be extended in both `server/src/types.ts` and `src/types.ts` to keep them in sync.

9. **Validation placement**: Should validation (min <= max, numeric) happen in `parseFilters` (returning `undefined` for invalid values) or in the route handler (returning 400)? Recommendation: `parseFilters` returns `undefined` for non-numeric; route handler checks min <= max and returns 400 if violated.

10. **UI layout**: Adding 4 new inputs to the FilterBar grid may require layout adjustments. The current grid is `md:grid-cols-4`. Consider grouping the 4 bbox inputs into a visual "Bounding Box" section.

## Recommended Approach

### High-Level Plan

1. **Spec phase**: Add a new requirement "Geographic Bounding Box Filter" to `openspec/specs/sample-query/spec.md` with 5 scenarios (full bbox, partial bbox, empty bbox, inverted bounds, null coordinates).

2. **Design phase**:
   - Extend `SampleFilters` type in both `server/src/types.ts` and `src/types.ts` with 4 optional number fields: `norteMin?`, `norteMax?`, `esteMin?`, `esteMax?`
   - Extend `buildWhere` in `server/src/routes/samples.ts` to add 4 new conditions (after the existing 9, maintaining order)
   - Extend `parseFilters` to parse the 4 new query params as floats (use `Number.parseFloat` instead of `Number.parseInt`)
   - Add validation in the route handler: if both min and max are present for an axis, ensure min <= max; else return 400
   - Update `pg-mock.ts` to recognize the 4 new bbox patterns in `extractFilters` and apply them in `applyFilters`
   - Extend `toQuery` in `src/services/api.ts` to include the 4 new keys
   - Add 4 new inputs to `FilterBar.tsx` (numeric inputs, grouped visually)
   - Update `FilterBar.test.tsx` to test the new fields

3. **Tasks phase**: Break into 3 task groups:
   - **API**: Extend types, buildWhere, parseFilters, add validation, update pg-mock, add API tests
   - **SPA**: Extend types, toQuery, FilterBar, FilterBar tests
   - **Spec**: Update sample-query/spec.md with new requirement and scenarios

4. **Apply phase**: Implement in order: spec → API types → buildWhere → parseFilters → validation → pg-mock → API tests → SPA types → toQuery → FilterBar → FilterBar tests

5. **Verify phase**: Run `pnpm test` to ensure all tests pass. Verify the bbox filter works end-to-end.

6. **Archive phase**: Merge the delta spec into `openspec/specs/sample-query/spec.md`.

### Key Decisions

- **Validation strategy**: Parse as float in `parseFilters`, validate min <= max in route handler (return 400 if violated)
- **Partial bounds**: Allow any subset of the 4 params; each present param adds a constraint
- **Inverted bounds**: Return 400 Bad Request (fail fast, surface user error)
- **Null coordinates**: Naturally excluded by SQL comparisons; no special handling
- **UI grouping**: Group the 4 bbox inputs into a visual section with a label "Bounding Box" or "Coordenadas"
- **Mock pool update**: Add 4 new regex patterns to `extractFilters` and 4 new filter applications to `applyFilters`

## Next Steps

The exploration is complete. The orchestrator should proceed to the **propose** phase to create a formal change proposal with intent, scope, and approach.
