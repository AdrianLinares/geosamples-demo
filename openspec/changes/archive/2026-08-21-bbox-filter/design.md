# Design: Geographic Bounding-Box Filter for Sample Queries

## Technical Approach

Append four bbox conditions at the END of `buildWhere` (slots 9-12), preserving the fixed 9-condition order that `pg-mock.ts` depends on. Each present bound pushes one positional param (`$N`) with `s.norte >= $N` / `s.norte <= $N` / `s.este >= $N` / `s.este <= $N`. Null coordinates are excluded naturally — SQL NULL comparisons yield NULL (falsy), so `s.norte >= $N` drops null rows without an explicit `IS NOT NULL`. A local `num()` parser (parseFloat) in `parseFilters` returns `number | undefined` so absent bounds produce no condition. Inverted-box validation runs in both route handlers before `buildWhere`, mirroring the existing `res.status(400).json({ error })` pattern from POST `/samples`. Maps directly to the proposal's Approach 1 and the 4 spec requirements.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Local `num()` parser in parseFilters | `parseFloat`-based, returns `number \| undefined` | Reuse `normalizeNumber` from `ingest/normalize.ts` | `normalizeNumber` returns `null`; `buildWhere`'s guard (`!== undefined && !== ""`) would then push a null param — wrong. Undefined semantics match the other 9 filters. |
| Append bbox at end of buildWhere | Slots 9-12 after the 9 existing conditions | Insert in semantic order | Preserves the exact param order `pg-mock.ts` regex relies on; zero disruption to slots 0-8. |
| Shared `validateBbox(filters)` helper | Returns `string \| null`; called in both `/samples` and `/export` before `buildWhere` | Inline check per handler | DRY across two endpoints sharing the identical validation requirement; matches the spec's "validation MUST run before query execution". |
| Group bbox inputs in a fieldset sub-grid | `<fieldset className="md:col-span-4">` wrapping `grid grid-cols-2 md:grid-cols-4` | Flatten into the 14-item grid | Keeps the 4 bbox inputs visually grouped as a coherent spatial unit and avoids the q/button layout overflow. |
| Add one null-coord fixture | Add a fixture with `norte: null, este: null` | Keep all 99 non-null and document NULL as inherent SQL | Makes the spec's "Null coordinates excluded" scenario testable in the mock at near-zero cost; the mock's `r.norte !== null` guard faithfully emulates SQL NULL-comparison falsiness. |

## Data Flow

```
Request ?norteMin=1005&norteMax=1010&esteMin=2000
  │
  ▼
parseFilters(query) ──→ SampleFilters { norteMin:1005, norteMax:1010, esteMin:2000, esteMax:undefined }
  │
  ▼
validateBbox(filters) ──→ null (ok) | "norteMin must be ≤ norteMax" (400)
  │  400: res.status(400).json({ error }) ──→ client
  ▼
buildWhere(filters) ──→ { conditions:[..., s.norte>=$10, s.norte<=$11, s.este>=$12], params:[...,1005,1010,2000] }
  │
  ▼
whereClause ──→ SELECT ... WHERE ... AND s.norte >= $10 AND s.norte <= $11 AND s.este >= $12
  │  (NULL norte/este rows excluded by SQL NULL-comparison falsiness)
  ▼
pool.query ──→ JSON | CSV
```

## File Changes

| File | Action | Description |
|---|---|---|
| `server/src/routes/samples.ts` | Modify | Add `num()` parser + 4 fields in `parseFilters`; 4 conditions at end of `buildWhere`; `validateBbox()` helper; call it in `/samples` and `/export` before `buildWhere`. |
| `server/src/types.ts` | Modify | Add `norteMin?: number; norteMax?: number; esteMin?: number; esteMax?: number;` to `SampleFilters`. |
| `src/types.ts` | Modify | Mirror the 4 fields in SPA `SampleFilters`. |
| `src/components/FilterBar.tsx` | Modify | 4 `useState` + 4 numeric inputs in a fieldset sub-grid; serialize in `handleSubmit` (empty→undefined); reset in `handleClear`. |
| `src/services/api.ts` | Modify | Add 4 entries to `toQuery` entries array. |
| `server/tests/pg-mock.ts` | Modify | Extend `extractFilters` array to 13 slots + 4 grabs; 4 branches in `applyFilters` with `!== null` guards; add 1 null-coord fixture. |
| `server/tests/api.test.ts` | Modify | bbox range, single bound, inverted-box 400 (north+east), equal bounds, export+bbox, combined, null-coord exclusion. |
| `src/components/FilterBar.test.tsx` | Modify | 4 inputs render, submit serializes, empty omitted, clear resets. |
| `src/services/api.test.ts` | Modify | `toQuery` serializes 4 bbox params, omits undefined. |

## Interfaces / Contracts

```ts
// server/src/types.ts AND src/types.ts (mirrored)
export type SampleFilters = {
  // ...existing 9 fields + page + pageSize...
  norteMin?: number;   // EPSG:3115 north lower bound (inclusive)
  norteMax?: number;   // EPSG:3115 north upper bound (inclusive)
  esteMin?: number;    // EPSG:3115 east lower bound (inclusive)
  esteMax?: number;    // EPSG:3115 east upper bound (inclusive)
};

// server/src/routes/samples.ts
function validateBbox(f: SampleFilters): string | null {
  if (f.norteMin !== undefined && f.norteMax !== undefined && f.norteMin > f.norteMax)
    return "norteMin must be less than or equal to norteMax";
  if (f.esteMin !== undefined && f.esteMax !== undefined && f.esteMin > f.esteMax)
    return "esteMin must be less than or equal to esteMax";
  return null;
}

// buildWhere — appended after the q condition:
if (filters.norteMin !== undefined && filters.norteMin !== "") {
  params.push(filters.norteMin);
  conditions.push(`s.norte >= $${params.length}`);
}
// ...norteMax → s.norte <= $N, esteMin → s.este >= $N, esteMax → s.este <= $N

// pg-mock applyFilters — null-coord rows fail the !== null guard (emulates SQL):
if (params[9] !== undefined)
  out = out.filter((r) => r.norte !== null && r.norte >= Number(params[9]));
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit (api.test.ts) | north range, single bound, inverted north box → 400, inverted east box → 400, equal bounds accepted, combined rock+bbox, null-coord excluded | supertest against `MockPool`; assert `res.body.total` and 400 `res.body.error`. |
| Unit (api.test.ts) | export with bbox returns only matching rows | supertest `/export`; parse CSV, assert row count matches mock filter. |
| Unit (FilterBar.test.tsx) | 4 bbox inputs render; submit serializes params; empty omitted; clear resets | @testing-library/react + userEvent; assert `onSearch` payload. |
| Unit (api.test.ts SPA) | `toQuery` emits `norteMin=...` etc., omits undefined | direct call assertions. |
| Regression | all existing filter tests pass | run full vitest suite. |

Commands: `npx vitest run` (root, runs SPA + server workspaces), `npx vitest run server` for backend only.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. The change adds query-param validation and SQL conditions to existing routes only.

## Migration / Rollout

No migration required. All changes are additive (new optional params, new inputs). Reverting the feature branch restores prior state with zero data migration.

## Open Questions

- None. All decisions resolved from proposal + spec + codebase patterns.
