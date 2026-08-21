## Exploration: bbox-filter

### Current State

The system has a well-established filter pipeline:

**Backend** (`server/src/routes/samples.ts`):
- `parseFilters(query)` extracts string/int params from the query string
- `buildWhere(filters)` builds SQL conditions in FIXED order: code, rock, unit, collector, analysis, plancha, dateFrom, dateTo, q. Each present filter appends one condition with a positional param `$N`.
- `whereClause(conditions)` joins with AND
- The GET `/samples` and `/samples/export` handlers both use this pipeline
- Param numbering is dynamic: `params.push(value); conditions.push(\`... $${params.length}\`)`

**Types** (duplicated, not shared):
- `server/src/types.ts` SampleFilters: code, rock, unit, collector, analysis, plancha, dateFrom, dateTo, q, page, pageSize
- `src/types.ts` SampleFilters: identical mirror
- Both `Sample` types include `norte: number | null` and `este: number | null`

**SPA FilterBar** (`src/components/FilterBar.tsx`):
- 9 `useState` fields (code, rock, unit, collector, analysis, plancha, dateFrom, dateTo, q)
- `handleSubmit` builds SampleFilters object, converting empty strings to undefined
- `handleClear` resets all fields and calls `onSearch({})`
- Grid layout: `grid grid-cols-1 gap-3 md:grid-cols-4`
- The "q" field spans `md:col-span-3`, buttons in a flex container

**SPA API client** (`src/services/api.ts`):
- `toQuery(filters)` enumerates each key explicitly in an entries array
- Skips undefined/null/empty values
- Returns `?key=value&...` or empty string

**Test infrastructure**:
- `server/tests/pg-mock.ts` — 99 fixture rows with `norte: 1000+i`, `este: 2000+i` (all non-null)
- `extractFilters(sql, params)` uses regex to find placeholders by position in the WHERE clause
- `applyFilters(rows, params)` applies 9 fixed-slot filters (indices 0-8)
- The mock relies on the EXACT condition order in buildWhere
- API tests use supertest, assert `res.body.total` for filter correctness
- SPA tests use @testing-library/react + userEvent + vi.fn() mocks

**OpenSpec**:
- 6 existing specs in `openspec/specs/`
- `sample-query/spec.md` defines the current filter contract with Given/When/Then + RFC 2119 keywords

### Affected Areas

- `server/src/routes/samples.ts` — add 4 bbox conditions to buildWhere (MUST append at end), add 4 numeric parsers to parseFilters
- `server/src/types.ts` — add norteMin, norteMax, esteMin, esteMax to SampleFilters
- `src/types.ts` — mirror the 4 new fields in SPA SampleFilters
- `src/components/FilterBar.tsx` — add 4 numeric inputs, update handleSubmit/handleClear, adjust grid layout
- `src/services/api.ts` — add 4 entries to toQuery
- `server/tests/pg-mock.ts` — extend extractFilters regex (4 new grabs), extend applyFilters (4 new branches), extend fixtures array from 9 to 13 slots
- `server/tests/api.test.ts` — add bbox filter tests
- `src/components/FilterBar.test.tsx` — add bbox input tests
- `src/services/api.test.ts` — add bbox query string tests
- `openspec/specs/sample-query/spec.md` — add bbox requirement + scenarios (archive phase)

### Approaches

1. **Append bbox conditions at end of buildWhere** — add norteMin, norteMax, esteMin, esteMax after the existing 9 conditions
   - Pros: Preserves existing mock slot indices 0-8, minimal disruption, natural SQL (NULL comparisons excluded automatically)
   - Cons: Mock must be extended to slots 9-12, buildWhere grows to 13 conditions
   - Effort: Low

2. **Group bbox into a single "bbox" object param** — parse as `bbox=norteMin,norteMax,esteMin,esteMax`
   - Pros: Fewer query params, cleaner URL
   - Cons: Breaks the existing pattern of individual params, requires custom parsing, harder to test individually
   - Effort: Medium

3. **Use PostGIS ST_MakeEnvelope** — spatial index-friendly bbox query
   - Pros: More efficient for large datasets, standard spatial pattern
   - Cons: Requires PostGIS extension (not currently installed), overkill for 99 records, adds infrastructure dependency
   - Effort: High

**Recommended**: Approach 1 — append bbox conditions at end. Matches existing patterns, minimal risk, no new dependencies.

### Risks

- **Mock slot ordering** (severity: medium) — The pg-mock uses regex to extract params by position. Adding 4 new conditions means 4 new regex grabs. If the order is wrong, tests break silently. Mitigation: add bbox conditions at the END, extend mock slots 9-12.
- **Null coordinate handling** (severity: low) — SQL `s.norte >= $N` naturally excludes NULLs. No explicit `IS NOT NULL` needed. But the mock fixtures have all non-null coords, so we can't test null exclusion without modifying fixtures. Mitigation: accept that the mock can't test this edge case, or add a fixture with null coords.
- **FilterBar layout** (severity: low) — Adding 4 inputs to a 4-column grid with 10 existing items (9 inputs + buttons) creates 14 items. The "q" field spans 3 columns. Mitigation: group bbox inputs in a sub-section or fieldset, or adjust grid to accommodate.
- **Type duplication** (severity: low) — SampleFilters is duplicated in server and SPA. Both must be updated. Mitigation: update both, add a comment reminding maintainers to keep them in sync (already present).

### Ready for Proposal

**Yes** — the codebase is well-structured for this change. The filter pipeline is extensible, the types are clear, and the test infrastructure can be extended. The main constraint is the fixed condition order in buildWhere (mock dependency), which is easily handled by appending bbox conditions at the end.

The orchestrator should proceed to the **propose** phase. The proposal should:
- Specify the 4 query params: norteMin, norteMax, esteMin, esteMax (all optional, numeric)
- Clarify that null coordinates are excluded when a bound is present (natural SQL behavior)
- Note that the FilterBar layout may need adjustment (4 new inputs in a 4-column grid)
- Mention that the pg-mock must be extended to slots 9-12
