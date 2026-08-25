## Exploration: Security Headers Hardening

### Current State

The API uses `helmet()` with **no configuration** at `server/src/index.ts:29`:

```typescript
app.use(helmet());
```

This activates all 13 helmet default headers. The relevant defaults for this change:

| Header | Current Default | Requested Value | Match? |
|--------|----------------|-----------------|--------|
| `X-Content-Type-Options` | `nosniff` | `nosniff` | ✅ Already correct |
| `X-Frame-Options` | `SAMEORIGIN` | `DENY` | ❌ Needs change |
| `Referrer-Policy` | `no-referrer` | `strict-origin-when-cross-origin` | ❌ Needs change |
| `Content-Security-Policy` | Complex default (see below) | `default-src 'self'; frame-ancestors 'none'` | ❌ Needs clarification |

**Current CSP default** (from helmet v8.0.0):
```
default-src 'self';
base-uri 'self';
font-src 'self' https: data:;
form-action 'self';
frame-ancestors 'self';
img-src 'self' data:;
object-src 'none';
script-src 'self';
script-src-attr 'none';
style-src 'self' https: 'unsafe-inline';
upgrade-insecure-requests
```

The requirement specifies only two CSP directives: `default-src 'self'` and `frame-ancestors 'none'`. This raises a critical question: **should we replace ALL existing CSP directives with just these two, or keep the existing defaults and only override `frame-ancestors`?**

The literal reading suggests replacement, but this would:
- Remove `upgrade-insecure-requests` (breaks HTTPS enforcement)
- Remove `base-uri 'self'` (opens base tag hijacking)
- Remove `form-action 'self'` (allows form submission to external sites)
- Remove `script-src 'self'` (allows scripts from any origin)
- Remove protection against many XSS vectors

### Affected Areas

- `server/src/index.ts` — Line 29: `helmet()` call needs configuration object
- `server/tests/api.test.ts` — Need to add header assertions to existing tests

### Architecture Context

**Frontend/Backend separation:**
- Express API runs on port 3001 (does NOT serve static files)
- Vite dev server serves the SPA and proxies `/api` → `http://localhost:3001`
- No iframe or frame elements in the frontend codebase
- No cross-origin embedding scenarios detected

**Test patterns:**
- Tests use `supertest` with `request(app)`
- Header assertions follow the pattern: `expect(res.headers["header-name"]).toBe("value")`
- Existing header tests: `www-authenticate` (auth tests), `content-type` (CSV export)
- Health endpoint is at `/health`, NOT `/api/health` (discrepancy with requirement)

### Approaches

#### Approach 1: Literal interpretation — Replace CSP entirely
Configure helmet to set ONLY the specified CSP directives:
```typescript
app.use(helmet({
  xFrameOptions: { action: "deny" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "frame-ancestors": ["'none'"]
    }
  }
}));
```

**Pros:**
- Exact match to requirement text
- Simpler CSP

**Cons:**
- Removes critical security protections (upgrade-insecure-requests, script-src, form-action, etc.)
- Breaks HTTPS enforcement
- Opens XSS and form hijacking vectors
- Likely not the intent

**Effort:** Low

#### Approach 2: Minimal override — Keep defaults, override only what's specified
Configure helmet to keep all defaults but override the specific directives:
```typescript
app.use(helmet({
  xFrameOptions: { action: "deny" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  contentSecurityPolicy: {
    directives: {
      "frame-ancestors": ["'none'"]  // Override only this
    }
  }
}));
```

**Pros:**
- Maintains all existing security protections
- Minimal change surface
- `X-Content-Type-Options: nosniff` remains (already default)

**Cons:**
- Doesn't match literal requirement text (CSP will have more directives)
- May confuse stakeholders expecting exact match

**Effort:** Low

#### Approach 3: Explicit full CSP — Specify all directives explicitly
Write out the complete CSP with all desired directives:
```typescript
app.use(helmet({
  xFrameOptions: { action: "deny" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "font-src": ["'self'", "https:", "data:"],
      "form-action": ["'self'"],
      "frame-ancestors": ["'none'"],
      "img-src": ["'self'", "data:"],
      "object-src": ["'none'"],
      "script-src": ["'self'"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "upgrade-insecure-requests": []
    }
  }
}));
```

**Pros:**
- Explicit and auditable
- Maintains all security protections
- Clear intent

**Cons:**
- More verbose
- Requires understanding of all CSP directives

**Effort:** Low-Medium

### Recommendation

**Approach 2 (Minimal override)** is recommended because:

1. **Security-first**: Maintains all existing protections (upgrade-insecure-requests, script-src, form-action, etc.)
2. **Minimal change**: Only overrides what the requirement explicitly asks to change
3. **`X-Content-Type-Options: nosniff`** is already correct (helmet default)
4. **`frame-ancestors 'none'`** is the only CSP directive that needs override
5. **Backward compatible**: No risk of breaking existing functionality

The literal requirement text appears to be a **simplified specification** rather than a complete replacement. The intent is to harden specific headers while maintaining existing security posture.

### Risks

1. **Endpoint path discrepancy**: Requirement mentions `GET /api/health` but the actual endpoint is `/health`. Tests should verify headers on the correct endpoint.

2. **`upgrade-insecure-requests` on localhost**: If the development environment uses HTTP (not HTTPS), this directive may cause issues. However, the current helmet default includes it, so this is already the case.

3. **CSP interpretation ambiguity**: The requirement specifies only two CSP directives. If stakeholders expect the EXACT CSP (not the full default), Approach 1 would be needed, but this significantly weakens security.

4. **Test coverage**: Existing tests don't assert security headers. Adding assertions to `GET /health` and `GET /api/samples` is straightforward but must be done carefully to avoid false positives.

### Open Questions

1. **CSP scope**: Should the CSP contain ONLY `default-src 'self'; frame-ancestors 'none'` (literal reading), or should we keep all helmet defaults and only override `frame-ancestors` (security-first reading)?

2. **Health endpoint path**: Should tests verify headers on `/health` (actual endpoint) or `/api/health` (requirement text)?

3. **Test placement**: Should header assertions be added to existing test cases, or should there be a dedicated `describe("security headers")` block?

### Ready for Proposal

**Yes** — with clarification on the CSP scope question. The recommended approach (minimal override) is ready to proceed once the CSP interpretation is confirmed.

If the literal interpretation is required (Approach 1), the proposal should explicitly document the security tradeoffs and get stakeholder approval.
