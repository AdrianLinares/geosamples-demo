# Proposal: Explicit Security Header Hardening

## Intent

The API calls `helmet()` with no configuration (`server/src/index.ts:29`), relying entirely on helmet defaults. The consigna requires hardening four specific headers to exact values while keeping all other existing hardening intact. No tests currently verify any security header — this change makes the configuration explicit and covers it with tests for the first time.

## Scope

### In Scope
- Make helmet config explicit in `server/src/index.ts:29` for: `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, CSP `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff` — already correct (helmet default), no config change; verified by tests
- Add header assertions in `server/tests/api.test.ts` on `GET /health` and `GET /api/samples`

### Out of Scope
- HSTS / Strict-Transport-Security tuning (helmet default kept as-is)
- Rate-limit changes (existing 300/15min kept)
- CORS changes (keep `cors()` default)
- SPA-level CSP (API serves no static files; Vite dev server is separate)
- Adding a `/api/health` route (actual endpoint is `/health`)

## Capabilities

### New Capabilities
- `security-headers`: HTTP security header configuration and verification for all API responses — defines exact required values for the 4 headers plus the invariant that all other helmet defaults remain active.

### Modified Capabilities
None.

## Approach

**Recommended: Approach 2 — Minimal override (merge with helmet defaults).**

The consigna's two constraints are in tension for CSP:
1. "valores exactos" → CSP must include `default-src 'self'; frame-ancestors 'none'`
2. "mantené el resto del hardening existente intacto" → keep existing hardening

**Approach 1** (literal replacement — only 2 CSP directives) satisfies #1 but **violates #2**: it removes 10 security directives (upgrade-insecure-requests, script-src, form-action, base-uri, object-src, etc.), actively *weakening* security — the opposite of "endurecé." Ruled out.

**Approach 2** satisfies **both**: helmet v8's `contentSecurityPolicy.directives` MERGES with the default policy (`useDefaults` defaults to `true` — confirmed via helmet v8 docs). Overriding only `frame-ancestors` to `'none'` keeps all 12 default directives while changing the one that matters. The resulting CSP contains both required values (`default-src 'self'` + `frame-ancestors 'none'`) plus the full existing hardening — the only self-consistent reading of both constraints.

**Approach 3** (explicit full CSP) also satisfies both but duplicates helmet's defaults, creating drift risk if helmet updates. Approach 2 is DRY, minimal, and faithful to "mantené el resto intacto."

```typescript
app.use(helmet({
  xFrameOptions: { action: "deny" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  contentSecurityPolicy: { directives: { "frame-ancestors": ["'none'"] } },
}));
```

Tests: dedicated `describe("security headers")` block asserting all 4 headers on `GET /health` and `GET /api/samples`. CSP assertions use `toContain` for required directives (resilient to helmet version updates); the other 3 headers use exact `toBe` assertions.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `server/src/index.ts` | Modified | Line 29: `helmet()` → explicit config object |
| `server/tests/api.test.ts` | Modified | New `describe("security headers")` block with 4 header × 2 endpoint assertions |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CSP has more than 2 directives (not literally "exact") | Medium | Both constraints reconciled only under merge interpretation; literal replacement violates "mantené el resto intacto" |
| `/api/health` doesn't exist (actual is `/health`) | Low | Test on `/health`; helmet is app-level middleware — headers identical on all routes |
| `upgrade-insecure-requests` on localhost HTTP | Low | Already in helmet default; no change introduced |

## Rollback Plan

Revert `server/src/index.ts:29` to `app.use(helmet())` and remove the `describe("security headers")` test block. All changes are configuration and test additions — no data migration, no breaking changes.

## Dependencies

None — helmet v8.0.0 already installed.

## Success Criteria

- [ ] `X-Content-Type-Options: nosniff` present on all responses
- [ ] `X-Frame-Options: DENY` present (was SAMEORIGIN)
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` present (was no-referrer)
- [ ] CSP contains `default-src 'self'` and `frame-ancestors 'none'` (was 'self')
- [ ] All other helmet default headers remain unchanged
- [ ] Header assertions pass on `GET /health` and `GET /api/samples`
- [ ] All existing tests pass (no regression)

## Proposal Question Round

**CSP interpretation**: The consigna's two constraints ("valores exactos" + "mantené el resto intacto") are contradictory under literal CSP replacement. This proposal recommends Approach 2 (merge) as the only self-consistent reading. If you require the literal CSP (only 2 directives), that removes 10 security directives and contradicts "mantené el resto intacto" — please confirm which interpretation you want.

**Health endpoint**: The consigna says test on `GET /api/health` but the actual endpoint is `/health` (`index.ts:43`). Proposal tests on `/health`. Should we also add a `/api/health` alias?
