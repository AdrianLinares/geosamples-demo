# Archive Report: bbox-filter

**Change**: bbox-filter
**Archived**: 2026-08-20
**Archived to**: `openspec/changes/archive/2026-08-20-bbox-filter/`
**Spec store**: Hybrid (engram + openspec)

## What Was Delivered

Added a geographic bounding-box filter to `GET /api/samples` and the SPA FilterBar. Four optional numeric query parameters (`norteMin`, `norteMax`, `esteMin`, `esteMax`) constrain results to a closed box over UTM coordinates (norte/este, Magna Colombia Bogotá). The filter appends `>=`/`<=` pairs last in `buildWhere`, validates per-axis min<=max → 400, excludes NULL coordinates via SQL semantics, and provides partial-bounds support (open-ended on omitted axes). The SPA FilterBar exposes 4 numeric inputs in a grouped "Bounding Box" section with submit/clear behavior.

## Final-State Facts (Orchestrator-Verified)

These facts are the authoritative record at close, per the Final-State Authority hierarchy.

| Fact | Value |
|------|-------|
| Tasks complete | 18/18 (all `[x]` in `tasks.md`) |
| Verify verdict | PASS |
| Test suite | 98/98 green across 8 files |
| API tests | `pnpm test:api` 44/44 |
| SPA tests | `pnpm test:spa` 27/27 |
| Typecheck (server) | `pnpm typecheck:server` pass |
| Typecheck (root) | `pnpm exec tsc --noEmit` pass |
| Requirements | 1/1 (Geographic Bounding Box Filter) |
| Scenarios | 5/5 met |
| CRITICAL findings | 0 |
| WARNING findings | 0 |
| SUGGESTIONS | 1 (non-blocking, future work) |
| Commits | `a21ba13` (server), `e24634f` (SPA) |
| Evidence revision | `sha256:f14cc6e8b576a06c14671560138387395a2edaf3f473c831ec22c65cffef1f09` |
| Runtime attempt ledger | apply: complete; verify: complete; no remediation required |
| Diff stat | 8 files changed, 251 insertions, 9 deletions (~260 lines, within 400-line budget) |

## Spec Scenario Traceability

| # | Scenario | Test | File:Line |
|---|----------|------|-----------|
| 1 | Full bounding box narrows results | `filters by a full bounding box and includes boundary rows` | `server/tests/api.test.ts:229` |
| 2 | Partial bounds leave the omitted axis open | `filters by partial bounds without constraining the omitted axis` | `server/tests/api.test.ts:243` |
| 3 | Omitted bbox applies no geographic constraint | `remains geographically unconstrained when no bbox params are given` | `server/tests/api.test.ts:249` |
| 4 | Inverted bounds are rejected | `rejects inverted bounds with a 400 naming the invalid axis` | `server/tests/api.test.ts:255` |
| 5 | NULL coordinates are excluded | `excludes samples with NULL coordinates from bbox results but keeps them unfiltered` | `server/tests/api.test.ts:274` |

## Findings

**CRITICAL**: None
**WARNING**: None
**SUGGESTION** (non-blocking, future work): FilterBar bbox submit test (`src/components/FilterBar.test.tsx:76–102`) asserts only the all-4-fields case. A test with 2 of 4 fields filled would strengthen coverage of the empty→undefined path for individual fields. This is not addressed in this change.

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| sample-query | Updated | 1 ADDED requirement ("Geographic Bounding Box Filter" with 5 scenarios) appended to `openspec/specs/sample-query/spec.md` |

## Archive Contents

- `proposal.md` ✅
- `specs/sample-query/spec.md` ✅
- `design.md` ✅
- `tasks.md` ✅ (18/18 tasks complete)
- `verify-report.md` ✅
- `exploration.md` ✅

## Source of Truth Updated

The canonical spec at `openspec/specs/sample-query/spec.md` now contains 5 requirements including the new Geographic Bounding Box Filter.

## Engram Observation IDs

| Artifact | Observation ID | Sync ID |
|----------|---------------|---------|
| proposal | #35 | `obs-0bbe730386f2e3e1` |
| spec | #36 | `obs-b1ab71680c19cb01` |
| design | #37 | `obs-7918f4b5b63d0f75` |
| tasks | #38 | `obs-e743416b04ebc52f` |
| apply-progress | #39 | `obs-063409f442359d8d` |
| verify-report | #40 | `obs-b035822b1236d8a5` |

## SDD Cycle Complete

The change has been fully planned, implemented, verified, and archived. Ready for the next change.
