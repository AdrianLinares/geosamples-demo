```yaml
schema: gentle-ai.verify-result/v1
evidence_revision: sha256:b8391d5744e2de29ba7abf5bc4ab60ffc310e4fb2dc3a836be4b36ad0d8112b8
verdict: pass
blockers: 0
critical_findings: 0
requirements: 4/4
scenarios: 12/12
test_command: npm test
test_exit_code: 0
test_output_hash: sha256:2bfd70e70afe7d59f9a3f4af29c41dfaf2cb8fd39aff036a404f8aa9da7d2211
build_command: npm run build
build_exit_code: 0
build_output_hash: sha256:3b8d5c7b68fd4b0eb54eec434389f7114146b332ce9ca7e6647c37541e9468ee
```

## Verification Report

**Change**: bbox-filter
**Mode**: Standard (Strict TDD NOT active)
**Date**: 2026-08-21

---

### Completeness Table

| Dimension | Status |
|-----------|--------|
| Proposal | Present |
| Specs | Present (4 requirements, 12 scenarios) |
| Design | Present |
| Tasks | Present (15/15 complete) |

---

### Build & Test Evidence

| Command | Exit Code | Result |
|---------|-----------|--------|
| `npm test` | 0 | 104 passed (8 files) |
| `npm run typecheck:server` | 0 | passed |
| `npm run build` | 0 | SPA typecheck + production build passed |

---

### Spec Compliance Matrix

#### Requirement 1: Bounding-Box Filter (4 scenarios)

| # | Scenario | Status | Evidence |
|---|----------|--------|----------|
| 1 | North range filter | ✅ COMPLIANT | `api.test.ts:229` — "filters by north range with inclusive bounds" (norteMin=1005, norteMax=1010 → 6 results) |
| 2 | Single bound only | ✅ COMPLIANT | `api.test.ts:238` — "filters by a single north bound only" (norteMin=1005 → 93 results, all >= 1005) |
| 3 | Combines with attribute filters | ✅ COMPLIANT | `api.test.ts:245` — "combines bbox with attribute filters" (rock=Granito + esteMin=2000, esteMax=2005 → 6 results) |
| 4 | Null coordinates excluded | ✅ COMPLIANT | `api.test.ts:252` — "excludes samples with null coordinates when any bbox bound is present" (99 → 98, SMPL0098 excluded) |

#### Requirement 2: Inverted-Box Validation (3 scenarios)

| # | Scenario | Status | Evidence |
|---|----------|--------|----------|
| 5 | Inverted north box rejected | ✅ COMPLIANT | `api.test.ts:260` — 400 with message "norteMin must be less than or equal to norteMax" |
| 6 | Inverted east box rejected | ✅ COMPLIANT | `api.test.ts:266` — 400 with message "esteMin must be less than or equal to esteMax" |
| 7 | Equal bounds accepted | ✅ COMPLIANT | `api.test.ts:272` — norteMin=1005, norteMax=1005 → 200, 1 result |

#### Requirement 3: CSV Export Inherits Bounding-Box Filter (2 scenarios)

| # | Scenario | Status | Evidence |
|---|----------|--------|----------|
| 8 | Export filtered by bbox | ✅ COMPLIANT | `api.test.ts:352` — "limits exported rows by bbox bounds" (norteMin=1005, norteMax=1010 → 7 lines = 6 data + header) |
| 9 | Export rejects inverted box | ✅ COMPLIANT | `api.test.ts:364` — 400 on inverted east range |

#### Requirement 4: FilterBar Bounding-Box Inputs (3 scenarios)

| # | Scenario | Status | Evidence |
|---|----------|--------|----------|
| 10 | Inputs serialized on submit | ✅ COMPLIANT | `FilterBar.test.tsx:92` — norteMin=1005, norteMax=1010, esteMin=2000, esteMax=2005 in onSearch payload |
| 11 | Empty inputs omitted | ✅ COMPLIANT | `FilterBar.test.tsx:122` — only norteMin=1005 submitted; norteMax, esteMin, esteMax undefined |
| 12 | Clear resets bbox inputs | ✅ COMPLIANT | `FilterBar.test.tsx:147` — clear → empty onSearch({}), all 4 inputs have value null |

**Compliance summary**: 12/12 scenarios compliant

---

### Correctness (Static Evidence)

| Requirement | Status | Notes |
|------------|--------|-------|
| Bounding-Box Filter | ✅ Implemented | `num()` parser, 4 conditions in `buildWhere` slots 9–12, null rows excluded by SQL NULL-comparison |
| Inverted-Box Validation | ✅ Implemented | `validateBbox()` called before `buildWhere` in both `/samples` and `/export` |
| CSV Export Inherits BBox | ✅ Implemented | `/export` route shares same `parseFilters` → `validateBbox` → `buildWhere` pipeline |
| FilterBar BBox Inputs | ✅ Implemented | 4 `useState` + numeric inputs in fieldset sub-grid, submit serializes, clear resets |

---

### Coherence (Design)

| Decision | Followed? | Notes |
|----------|-----------|-------|
| `num()` parser in parseFilters | ✅ Yes | parseFloat-based, returns `number \| undefined` |
| 4 bbox conditions at end of buildWhere (slots 9–12) | ✅ Yes | Appended after q condition |
| `validateBbox()` returning `string \| null` | ✅ Yes | Called in both `/samples` and `/export` |
| 13-slot extractFilters in pg-mock | ✅ Yes | 4 bbox grabs added |
| 4 applyFilters branches with `!== null` guards | ✅ Yes | Null-coord fixture on last row |
| Fieldset sub-grid for bbox inputs | ✅ Yes | `<fieldset>` with 4 numeric inputs |
| 4 bbox entries in toQuery | ✅ Yes | norteMin, norteMax, esteMin, esteMax |
| Commit 1 backend, Commit 2 SPA | ✅ Yes | `51d4666` backend, `05d5cf5` SPA |

#### Documented Deviations from Design

1. **Removed `!== ""` guard for bbox conditions in buildWhere.** TypeScript flagged the comparison as error TS2367 since `num()` returns `number | undefined`, never `""`. Guard reduced to `!== undefined` — semantically identical. **Status**: ACCEPTABLE.

2. **Null-coord fixture applied to last existing row instead of appending a new one.** Appending a 100th row would force updates to pagination, total-count, and CSV export assertions. **Status**: ACCEPTABLE — spec scenario fully covered.

---

### Commit Verification

| Commit | Description | Files Changed | Lines | Status |
|--------|-------------|---------------|-------|--------|
| `51d4666` | feat(api): add bounding-box filter to GET /api/samples | 5 files | +153/-9 | ✅ Matches design |
| `05d5cf5` | feat(web): add bounding-box inputs to FilterBar | 4 files | +172 | ✅ Matches design |

**Total changed lines**: 325 (under 400-line budget)

---

### Issues Found

**CRITICAL**: None
**WARNING**: None
**SUGGESTION**: React `type="number"` inputs with empty value report `null` (not `""`) via `@testing-library`'s `toHaveValue`. Documented in apply-progress. No action needed.

---

### Verdict

**PASS**

All 4 requirements met. All 12 spec scenarios have passing covering tests. Both typechecks pass. Production build passes. Design deviations are documented and acceptable. No blocking issues.
