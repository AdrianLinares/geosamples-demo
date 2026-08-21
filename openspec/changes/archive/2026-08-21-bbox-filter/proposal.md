# Proposal: Geographic Bounding-Box Filter for Sample Queries

## Intent

Users need to filter geological samples by geographic location within UTM Magna Colombia Bogotá (EPSG:3115). Today the API and FilterBar only support textual/attribute filters. Inclusive north/east bounding-box bounds let users spatially narrow the catalog — a core GIS workflow the coordinate data (`norte`/`este`) already supports.

## Scope

### In Scope
- Four optional numeric query params: `norteMin`, `norteMax`, `esteMin`, `esteMax` on `GET /api/samples` and `GET /api/samples/export`
- Inclusive comparisons (`>=` min, `<=` max) against `s.norte` / `s.este`
- Inverted-box validation -> HTTP 400 (when both bounds of a dimension are present and min > max)
- Four numeric inputs in the SPA FilterBar
- CSV export inherits the filter via shared `buildWhere`
- Updated `SampleFilters` types (server + SPA), `toQuery` serialization, pg-mock slots, tests

### Out of Scope
- PostGIS / `ST_MakeEnvelope` spatial indexing (overkill for 99 records)
- Map-based bbox selection UI (future work)
- Coordinate-system conversion (all data already EPSG:3115)

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `sample-query`: Adds a geographic bounding-box filter requirement (north/east inclusive bounds, inverted-box 400 rejection, null-coordinate exclusion) to the existing query contract.

## Approach

Append four bbox conditions at the END of `buildWhere` (preserving mock slot indices 0-8). Add a `num()` parser (parseFloat) to `parseFilters`. Each present bound becomes one `s.norte >= $N` / `<= $N` / `s.este >= $N` / `<= $N` comparison. Null coordinates excluded naturally (SQL NULL comparisons yield falsy). Inverted-box validation runs in the route handler before query build. Mirror 4 fields in both `SampleFilters` types, extend `toQuery` with 4 entries, add 4 numeric inputs to FilterBar (grouped sub-section), extend pg-mock slots 9-12.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `server/src/routes/samples.ts` | Modified | 4 bbox conditions in buildWhere, 4 parsers in parseFilters, 400 validation |
| `server/src/types.ts` | Modified | 4 fields in SampleFilters |
| `src/types.ts` | Modified | 4 fields mirrored in SPA SampleFilters |
| `src/components/FilterBar.tsx` | Modified | 4 numeric inputs, handleSubmit/handleClear, layout |
| `src/services/api.ts` | Modified | 4 entries in toQuery |
| `server/tests/pg-mock.ts` | Modified | 4 new regex grabs + applyFilters branches (slots 9-12) |
| `server/tests/api.test.ts` | Modified | bbox filter + 400 validation tests |
| `src/components/FilterBar.test.tsx` | Modified | bbox input tests |
| `src/services/api.test.ts` | Modified | bbox query string tests |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mock slot ordering breaks silently | Medium | Append at end (slots 9-12); extend extractFilters regex + applyFilters together |
| Null-coordinate exclusion untestable in mock | Low | Fixtures all non-null; document NULL exclusion as inherent SQL behavior |
| FilterBar layout overflow (14 items) | Low | Group bbox inputs in a fieldset/sub-grid |

## Rollback Plan

Revert the single feature branch. All changes are additive (new params, new inputs) — no existing filter behavior changes. Removing the 4 params, inputs, and mock slots restores prior state with zero migration.

## Dependencies

None — uses existing `norte`/`este` columns and the current `buildWhere` pipeline.

## Success Criteria

- [ ] `GET /api/samples?norteMin=1005&norteMax=1010` returns only samples within that north range
- [ ] `GET /api/samples?esteMin=2000&esteMax=2005` returns only samples within that east range
- [ ] Inverted box (`norteMin > norteMax`) returns HTTP 400 with a clear message
- [ ] CSV export respects the same bbox params
- [ ] SPA FilterBar renders 4 numeric inputs and serializes them into the query string
- [ ] All existing filter tests still pass (no regression)
