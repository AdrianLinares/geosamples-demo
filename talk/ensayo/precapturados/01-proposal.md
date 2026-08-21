# Proposal: Geographic Bounding-Box Filter (bbox-filter)

## Intent

The catalog stores UTM coordinates (`norte`/`este`, Magna Colombia Bogotá) but exposes no geographic subsetting — users filter only by text/date and inspect rows manually to find samples in a region. Add a closed bounding-box filter on `norte`/`este` to the query API and SPA FilterBar so the catalog can be scoped to an area of interest.

## Scope

### In Scope
- API: `GET /api/samples` params `norteMin`/`norteMax`/`esteMin`/`esteMax` via existing `buildWhere`; `parseFilters` float parsing; route validation (min<=max → 400)
- `SampleFilters` in `server/src/types.ts` AND `src/types.ts` (synced)
- SPA: `toQuery` entries, 4 `FilterBar` inputs grouped as "Bounding Box", state + clear
- Tests: `server/tests/api.test.ts`, `server/tests/pg-mock.ts` (`extractFilters`/`applyFilters`), `src/components/FilterBar.test.tsx`
- Delta spec: new "Geographic Bounding Box Filter" requirement in `sample-query`

### Out of Scope
Polygon/radius filters; map-based picker UI; coordinate reprojection; pagination changes.

## Capabilities

Contract for sdd-spec.

### New Capabilities
None.

### Modified Capabilities
- `sample-query`: add "Geographic Bounding Box Filter" requirement — closed box on `norte`/`este`, optional per-axis bounds, NULL coords excluded, inverted bounds → 400.

## Approach

Append 4 parametrized conditions to `buildWhere` LAST (preserving the existing 9-slot order the mock depends on): `norte >= $N`, `norte <= $N`, `este >= $N`, `este <= $N`. Add a `float` helper to `parseFilters` (NaN/Infinity → undefined). Validate per-axis min<=max in the route handler → 400; partial bounds allowed (open-ended on that side). Update `pg-mock.ts` regex in `extractFilters`/`applyFilters` for the shifted placeholder numbers. Extend `toQuery` entries and add 4 numeric `FilterBar` inputs in a grouped section. `sample-catalog` needs no change (`norte`/`este` already nullable numeric).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `server/src/routes/samples.ts` | Modified | `buildWhere` +4 conditions; `parseFilters` float helper; route 400 |
| `server/src/types.ts`, `src/types.ts` | Modified | `SampleFilters` +4 optional number fields (sync both) |
| `src/services/api.ts` | Modified | `toQuery` entries +4 keys |
| `src/components/FilterBar.tsx` | Modified | +4 inputs, state, submit/clear |
| `server/tests/pg-mock.ts` | Modified | `extractFilters`/`applyFilters` bbox slots |
| `server/tests/api.test.ts`, `FilterBar.test.tsx` | Modified | bbox test cases |
| `openspec/specs/sample-query/spec.md` | Delta | new requirement + scenarios |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mock placeholder-order coupling | High | Append bbox last; update mock regex in same change |
| `SampleFilters` drift (server vs SPA) | Med | Extend both files together; typecheck |
| Inverted-bounds UX (silent failure) | Med | 400 with a clear error message |
| Partial-bounds semantics ambiguity | Low | Each present param = one constraint; omitted = open-ended |

## Rollback Plan

Pure `git revert` — bbox params become unknown query params ignored by `parseFilters`. No schema or data migration, so no data loss.

## Dependencies

None external; builds on existing parameterized-query and FilterBar patterns.

## Success Criteria

- [ ] Four bbox params narrow results to the closed box
- [ ] Partial bounds apply only the given axis constraint
- [ ] Inverted bounds return 400
- [ ] NULL-coordinate samples excluded from bbox matches
- [ ] `pnpm test` and `tsc --noEmit` green
