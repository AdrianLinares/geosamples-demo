# Design: Geographic Bounding-Box Filter (bbox-filter)

## Technical Approach

Append four optional numeric query parameters (`norteMin`, `norteMax`, `esteMin`, `esteMax`, EPSG:3115 Magna Colombia Bogotá) to `GET /api/samples` and the SPA `FilterBar`. Each present bound becomes one `s.norte >= $N` / `s.norte <= $N` / `s.este >= $N` / `s.este <= $N` clause appended **last** (after the 9 existing slots), preserving the fixed placeholder order `pg-mock.ts` depends on. `parseFilters` gains a `float` helper (NaN/Infinity → `undefined`). The route handler validates per-axis `min <= max` → 400 on inversion; partial bounds apply only the given constraint and NULL coordinates are naturally excluded by SQL. This maps directly to the proposal's approach and the `sample-query` delta spec's five scenarios.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice & Rationale |
|---|---|---|---|
| Filter clause shape | `BETWEEN` vs `>=`/`<=` pairs | `BETWEEN` is one placeholder but forces both bounds; pairs allow partial open-ended bounds | **`>=`/`<=` pairs** — matches spec's "omitted bound leaves that side unconstrained" and keeps one condition per param. |
| Placeholder order | Interleave vs append-last | Interleave reads naturally but shifts existing slot numbers the mock regex keys on | **Append last** — zero churn to the 9 existing `extractFilters` grabs; mock only adds 4 new grabs. |
| Validation placement | `parseFilters` vs route handler | min<=max is a cross-field semantic concern, not a parse concern | **`parseFilters` parses floats (NaN/Infinity->undefined); route handler enforces min<=max -> 400.** |
| Inverted bounds | Empty result vs 400 | Empty is consistent with "no matches"; 400 surfaces user error | **400 with axis-named message** — fail-fast per spec scenario "Inverted bounds are rejected". |
| NULL coordinates | `coalesce`/special-case vs SQL natural | Special-casing adds noise | **SQL natural** — `s.norte >= $N` excludes NULL; zero extra code, matches spec scenario. |

## Data Flow

```
FilterBar -4 numeric inputs-> toQuery() -?norteMin=…&norteMax=…-> GET /api/samples
  -> parseFilters() (float, NaN->undefined) -> route validates min<=max
  | 400 on inverted                                  |
  v ok                                               v
buildWhere(): append norte>=/$N, norte<=/$N, este>=/$N, este<=/$N (last)
  -> WHERE ... AND s.norte >= $N ... -> pool.query() -> rows (NULL coords excluded)
```

Sequence (request with inverted bounds):

```
Client -> Route:  GET /api/samples?norteMin=1050&norteMax=1020
Route -> parseFilters: { norteMin:1050, norteMax:1020 }
Route -> Route: min>max -> res.status(400).json({error:"norteMin greater than norteMax"})
Route -> Client: 400 { error: "norteMin is greater than norteMax" }
```

## File Changes

| File | Action | Description |
|---|---|---|
| `server/src/types.ts` | Modify | `SampleFilters` += `norteMin?/norteMax?/esteMin?/esteMax?` (number) |
| `src/types.ts` | Modify | Mirror the same 4 fields (kept identical to server) |
| `server/src/routes/samples.ts` | Modify | `buildWhere` +4 conditions (last); `parseFilters` `float` helper; route handler min<=max->400 |
| `server/tests/pg-mock.ts` | Modify | `extractFilters` array 9->13 slots +4 grabs (`s.norte >=`, `s.norte <=`, `s.este >=`, `s.este <=`); `applyFilters` +4 numeric range filters |
| `server/tests/api.test.ts` | Modify | +bbox cases: full box, partial, out-of-range, inverted->400, NULL-excluded |
| `src/services/api.ts` | Modify | `toQuery` entries += 4 keys |
| `src/components/FilterBar.tsx` | Modify | +4 `useState`, grouped "Bounding Box" inputs, submit/clear |
| `src/components/FilterBar.test.tsx` | Modify | +bbox submission + clear assertions |

## Interfaces / Contracts

```ts
// SampleFilters (both server/src/types.ts and src/types.ts) — NEW fields appended
export type SampleFilters = {
  code?: string; rock?: string; unit?: string; collector?: string;
  analysis?: string; plancha?: string; dateFrom?: string; dateTo?: string;
  q?: string; page?: number; pageSize?: number;
  norteMin?: number; norteMax?: number; esteMin?: number; esteMax?: number; // NEW
};

// parseFilters float helper — mirrors existing int() helper
const float = (v: unknown): number | undefined => {
  const s = str(v);
  if (s === undefined) return undefined;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : undefined; // rejects NaN, Infinity
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit (API) | full box narrows; partial bounds; out-of-range -> 0; inverted -> 400; NULL coords excluded | supertest `request(app).get("/api/samples?norteMin=…")`, assert `total`/`data.length`/`status` |
| Unit (SPA) | bbox inputs serialize into `onSearch`; clear resets to `{}` | `@testing-library/react` + `userEvent`, assert `onSearch` called with bbox fields |
| Mock sync | `extractFilters`/`applyFilters` map shifted placeholders | covered implicitly by API tests (mock feeds all assertions) |
| Type | `SampleFilters` identical server<->SPA | `tsc --noEmit` (root) + `tsc -p server/tsconfig.json` |

Fixture ranges (pg-mock): `norte` 1000..1098, `este` 2000..2098 (e.g. `norteMin=1020&norteMax=1050&esteMin=2020&esteMax=2050` -> 31 rows).

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Adds query-param parsing + parameterized SQL only; all bbox values use `$N` placeholders, so no injection surface.

## Migration / Rollout

No migration required. `norte`/`este` already exist as nullable `DOUBLE PRECISION`. Rollback = `git revert`; unknown bbox params are ignored by `parseFilters`.

## Open Questions

- [ ] None — spec, exploration, and code patterns are unambiguous; validation strategy and clause shape are decided above.
