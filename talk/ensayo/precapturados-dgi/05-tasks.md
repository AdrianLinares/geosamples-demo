# Tasks: Explicit Security Header Hardening

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~60 (config ~15 + tests ~45) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Explicit helmet config + security-header tests | PR 1 | `pnpm test:api` | Supertest drives the real Express app in-process (no separate server); optional manual `curl -sI localhost:3001/health` | Revert `index.ts:29` to `helmet()`; delete the test block |

Threat matrix: N/A per design (no new boundary) — no RED-test tasks required. TDD off (`strict_tdd: false`).

## Phase 1: Configuration

- [x] 1.1 In `server/src/index.ts:29`, replace `app.use(helmet())` with explicit options: `xFrameOptions: { action: "deny" }`, `referrerPolicy: { policy: "strict-origin-when-cross-origin" }`, `contentSecurityPolicy: { useDefaults: true, directives: { "frame-ancestors": ["'none'"] } }`. Touch no other line.
  - Scenarios: prerequisite for all 10 (configuration source).
  - Acceptance: `npx tsc --noEmit` clean; existing `pnpm test` stays green (no header tests exist yet).

## Phase 2: Tests

- [x] 2.1 In `server/tests/api.test.ts`, append after `describe("misc")` (end of file, :503) a `// Security headers (spec security-headers)` banner and a `describe.each(["/health", "/api/samples"])("security headers on %s", ...)` block with 3 exact `it`s: `res.headers["x-content-type-options"]` → `toBe("nosniff")`, `res.headers["x-frame-options"]` → `toBe("DENY")`, `res.headers["referrer-policy"]` → `toBe("strict-origin-when-cross-origin")`.
  - Scenarios: nosniff ×2, DENY ×2, Referrer-Policy ×2 (6 of 10).
  - Acceptance: 6 new tests pass via `pnpm test:api`.

- [x] 2.2 Add a CSP containment `it` to the same block: 4× `expect(res.headers["content-security-policy"]).toContain(...)` for `default-src 'self'`, `frame-ancestors 'none'`, `script-src 'self'`, `object-src 'none'` (containment, never exact match).
  - Scenarios: CSP directives on GET /health · GET /api/samples (2 of 10).
  - Acceptance: 2 new tests pass via `pnpm test:api`.

- [x] 2.3 Add a preserved-hardening regression `it` to the same block: `strict-transport-security` → `toContain("max-age")` and `cross-origin-opener-policy` → `toBe("same-origin")`.
  - Scenarios: Non-target hardening on GET /health · GET /api/samples (2 of 10).
  - Acceptance: 2 new tests pass via `pnpm test:api`.

## Phase 3: Verification

- [x] 3.1 Run the full suite from repo root: `pnpm test`.
  - Scenarios: all 10 (5 requirements × 2 endpoints, 1:1 with spec).
  - Acceptance: all green — 10 new security-header tests present and passing, zero regressions.
