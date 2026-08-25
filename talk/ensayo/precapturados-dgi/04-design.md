# Design: Explicit Security Header Hardening

## Technical Approach

Replace the unconfigured `app.use(helmet())` at `server/src/index.ts:29` with an explicit helmet options object, inline inside `createApp()` (the repo's centralized middleware pattern — helmet, cors, rateLimit, morgan are all inline at :29-41; no separate config file). Only the three headers that differ from defaults are configured; `X-Content-Type-Options` needs no config (helmet hardcodes `nosniff`, `index.cjs:270-275`).

Option names verified against the **installed** `helmet@8.3.0` type defs (`index.d.cts`) and source (`index.cjs`). Note: spec cited v8.0.0 but the lockfile resolves 8.3.0; the API is identical for these keys.

```typescript
app.use(helmet({
  xFrameOptions: { action: "deny" },                                      // default sameorigin → DENY (index.cjs:297)
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },           // default no-referrer (index.cjs:214)
  contentSecurityPolicy: {
    useDefaults: true,                                                     // explicit: MERGE with 12 default directives
    directives: { "frame-ancestors": ["'none'"] },                         // override only this (index.cjs:84)
  },
}));
```

`useDefaults` defaults to `true` when omitted (`index.cjs:44`); setting it explicitly self-documents the merge. The directive Map is seeded with all 12 defaults, then `frame-ancestors` is overwritten (`index.cjs:45,84`), so the CSP carries `default-src 'self'` + `frame-ancestors 'none'` PLUS retained hardening (script-src, object-src, upgrade-insecure-requests, …) — satisfying both consigna constraints. Canonical names used (`xFrameOptions`, not deprecated `frameguard`).

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| CSP strategy | Merge: `useDefaults:true` + override `frame-ancestors` | Literal 2-directive replacement; explicit full CSP | Only merge satisfies both "valores exactos" and "mantené el resto intacto". Replacement drops 10 directives; full CSP duplicates defaults (drift). |
| `useDefaults: true` | Explicit | Rely on implicit default | Self-documents merge intent. |
| Option naming | Canonical (`xFrameOptions`) | Legacy aliases (`frameguard`, `noSniff`) | Matches type defs; aliases deprecated. |
| Config location | Inline in `createApp()` | Separate `middleware/security.ts` | Matches existing inline pattern. |
| CSP assertions | `toContain` per directive | Exact `toBe` | Spec mandates containment; resilient to reorder. Substrings unique (no false match on `base-uri 'self'` / `object-src 'none'`). |
## Trade-offs Rejected

- **Literal 2-directive CSP** — drops 10 protective directives; *weakens* security, contradicting "endurecé" + "mantené el resto intacto."
- **Separate middleware file** — breaks the centralized inline pattern; `index.ts` already owns helmet.
- **Explicit full CSP** — duplicates helmet defaults; drift risk on updates; non-DRY.
- **Exact `toBe` on CSP** — brittle; breaks on any directive addition/reorder.

## Data Flow

```
Client ──GET /health | /api/samples──→ Express
   │ helmet() (index.ts:29, app-level) sets 13 headers on res BEFORE the route handler:
   ▼   X-Content-Type-Options: nosniff · X-Frame-Options: DENY · Referrer-Policy: strict-origin-when-cross-origin
      Content-Security-Policy: ...default-src 'self';...;frame-ancestors 'none';... (merged)
      Strict-Transport-Security: max-age=31536000; includeSubDomains (default, no HTTPS gate, index.cjs:262)
      Cross-Origin-Opener-Policy: same-origin (default) · 7 other default headers unchanged
route handler ──→ JSON (headers already attached)
```

So the regression test works under supertest's plain HTTP.

## File Changes

| File | Action | Description |
|---|---|---|
| `server/src/index.ts` | Modify | Line 29: `helmet()` → explicit config object (3 options). No other lines touched. |
| `server/tests/api.test.ts` | Modify | Append `describe("security headers")` after `describe("misc")` (file ends :503); 10 tests via `describe.each`. |

## Test Design

New `describe("security headers")` block appended after `describe("misc")` (end of file, :503) with banner `// Security headers (spec security-headers)`. Uses `describe.each(["/health", "/api/samples"])` × 5 `it` = 10 tests = 10 scenarios (1:1 with spec). Safe placement: header checks are stateless, unaffected by prior stateful POST tests.

Reuses existing patterns: `request(app)` (supertest, :6) and lowercased `res.headers["..."]` (Node convention; used at :42 `www-authenticate`, :313 `content-type`). No auth needed — `AUTH_READS=false` in `beforeAll` (:20); `/health` always public.

```typescript
describe.each(["/health", "/api/samples"])("security headers on %s", (path) => {
  // 3 exact `toBe` its: x-content-type-options→"nosniff", x-frame-options→"DENY", referrer-policy→"strict-origin-when-cross-origin"
  // 1 containment `it`: 4× expect(csp).toContain("default-src 'self'" | "frame-ancestors 'none'" | "script-src 'self'" | "object-src 'none'")
  // 1 regression `it`: expect(hsts).toContain("max-age"); expect(coop).toBe("same-origin")
});
```

## Verification Plan — Scenario → Test

| Requirement | Endpoint | Assertion |
|---|---|---|
| Content-Type Sniffing | /health · /api/samples | `toBe("nosniff")` on x-content-type-options |
| Frame Embedding Denial | /health · /api/samples | `toBe("DENY")` on x-frame-options |
| Referrer Policy | /health · /api/samples | `toBe("strict-origin-when-cross-origin")` on referrer-policy |
| CSP Hardening | /health · /api/samples | 4× `toContain` (default-src 'self', frame-ancestors 'none', script-src 'self', object-src 'none') |
| Existing Hardening Preserved | /health · /api/samples | `toContain("max-age")` on HSTS + `toBe("same-origin")` on COOP |

5 requirements × 2 endpoints = 10 scenarios → 10 `describe.each` tests, 1:1. Regression: full `npx vitest run` stays green.

## Threat Matrix

N/A — no routing/shell/subprocess/VCS/process-integration boundary. Options to existing middleware + header assertions.

## Migration / Rollout

No migration. Revert `index.ts:29` to `helmet()` and delete the `describe("security headers")` block. Config + test additions only.

## Open Questions

- None. CSP interpretation settled at human gate (Approach 2 merge). Health endpoint is `/health` (actual route); `/api/health` doesn't exist, and helmet is app-level so headers are identical on every route.
