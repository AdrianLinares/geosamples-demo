# Archive Report: bbox-filter

**Change**: bbox-filter
**Archived**: 2026-08-21
**Archived to**: `openspec/changes/archive/2026-08-21-bbox-filter/`
**Spec store**: Hybrid (engram + openspec)

## What Was Delivered

Added a geographic bounding-box filter to `GET /api/samples` and the SPA FilterBar. Users can now filter geological samples by EPSG:3115 north/east coordinates (norteMin, norteMax, esteMin, esteMax) with inclusive bounds, inverted-box 400 rejection, null-coordinate exclusion, and CSV export inheritance.

## Final State (at close)

| Dimension | Value |
|-----------|-------|
| Commits | 2 — `51d4666` (backend), `05d5cf5` (SPA) |
| Tests | 104/104 passing (vitest) |
| Spec scenarios | 12/12 met |
| Changed lines | 334 (325 insertions + 9 deletions) — under 400-line budget |
| Verify verdict | PASS |
| CRITICAL findings | 0 |
| SUGGESTION findings | 1 (React `type="number"` null value in tests — no action needed) |

## Spec Sync

Delta spec `sample-query` merged into `openspec/specs/sample-query/spec.md`:
- 4 requirements ADDED: Bounding-Box Filter, Inverted-Box Validation, CSV Export Inherits Bounding-Box Filter, FilterBar Bounding-Box Inputs
- 12 scenarios added (4 + 3 + 2 + 3)
- Existing requirements preserved unchanged (Dimension Filters, Free-Text Search, Pagination, No-Filter Query)
- Main spec now has 8 requirements total

## Archive Contents

- proposal.md
- specs/sample-query/spec.md
- design.md
- tasks.md (15/15 tasks complete)
- apply-progress.md
- verify-report.md
- exploration.md

## Engram Observations

All SDD artifact observations persisted during the cycle:
- `sdd/bbox-filter/tasks` (#38)
- `sdd/bbox-filter/spec` (#36)
- `sdd/bbox-filter/design` (#37)
- `SDD verify-report: bbox-filter` (#40)
- `SDD apply-progress: bbox-filter` (#39)
- `bbox-filter proposal: geographic bounding-box filter` (#35)
- `bbox-filter exploration: coordinate model and filter pipeline` (#44)
- `SDD archive-report: bbox-filter` (#55 — prior run, superseded by this archive)

## Design Deviations (Accepted)

1. **Removed `!== ""` guard for bbox conditions in buildWhere.** TypeScript TS2367 flagged `num()` return type as `number | undefined`, never `""`. Guard reduced to `!== undefined` — semantically identical.
2. **Null-coord fixture applied to last existing row instead of appending new fixture.** Appending a 100th row would force updates to pagination, total-count, and CSV export assertions across the suite.

## Flags

- **Stale `openspec/config.yaml` testing section**: Says `runner: null`, `unit: false`, etc. — but vitest is the runner with 104 passing tests. Needs manual update outside this archive cycle.

## Source of Truth Updated

`openspec/specs/sample-query/spec.md` now reflects the new bounding-box filter behavior alongside existing query capabilities.

## SDD Cycle Complete

The change has been fully planned, implemented, verified, and archived. Ready for the next change.
