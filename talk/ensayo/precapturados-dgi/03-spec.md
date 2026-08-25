# security-headers Specification

## Purpose

Defines the HTTP security headers every API response MUST carry. Hardens selected helmet defaults (`X-Frame-Options`, `Referrer-Policy`, CSP `frame-ancestors`) while keeping all other helmet hardening intact. Configuration follows the centralized pattern in `server/src/index.ts`; verification covers `GET /health` and `GET /api/samples`.

## Requirements

### Requirement: Content-Type Sniffing Protection

Every API response MUST carry `X-Content-Type-Options: nosniff`. The value is helmet's default and MUST remain unchanged; this requirement places it under test.

#### Scenario: nosniff on GET /health

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /health`
- THEN the response MUST carry header `X-Content-Type-Options` with exact value `nosniff`

#### Scenario: nosniff on GET /api/samples

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /api/samples`
- THEN the response MUST carry header `X-Content-Type-Options` with exact value `nosniff`

### Requirement: Frame Embedding Denial

Every API response MUST carry `X-Frame-Options: DENY`, overriding helmet's default `SAMEORIGIN`.

#### Scenario: DENY on GET /health

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /health`
- THEN the response MUST carry header `X-Frame-Options` with exact value `DENY`

#### Scenario: DENY on GET /api/samples

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /api/samples`
- THEN the response MUST carry header `X-Frame-Options` with exact value `DENY`

### Requirement: Referrer Policy Hardening

Every API response MUST carry `Referrer-Policy: strict-origin-when-cross-origin`, overriding helmet's default `no-referrer`.

#### Scenario: Referrer-Policy on GET /health

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /health`
- THEN the response MUST carry header `Referrer-Policy` with exact value `strict-origin-when-cross-origin`

#### Scenario: Referrer-Policy on GET /api/samples

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /api/samples`
- THEN the response MUST carry header `Referrer-Policy` with exact value `strict-origin-when-cross-origin`

### Requirement: Content Security Policy Hardening

Every API response MUST carry a `Content-Security-Policy` header that contains `default-src 'self'` AND `frame-ancestors 'none'`, AND retains helmet's protective directives `script-src 'self'` and `object-src 'none'`. Verification MUST assert directive presence by containment, not exact header match, so the remaining helmet default directives stay intact.

#### Scenario: CSP directives on GET /health

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /health`
- THEN the `Content-Security-Policy` header MUST contain `default-src 'self'`
- AND MUST contain `frame-ancestors 'none'`
- AND MUST contain `script-src 'self'` and `object-src 'none'`

#### Scenario: CSP directives on GET /api/samples

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /api/samples`
- THEN the `Content-Security-Policy` header MUST contain `default-src 'self'`
- AND MUST contain `frame-ancestors 'none'`
- AND MUST contain `script-src 'self'` and `object-src 'none'`

### Requirement: Existing Hardening Preserved

All non-target helmet hardening headers MUST remain intact. As a regression guard, every API response MUST at minimum carry `Strict-Transport-Security` and `Cross-Origin-Opener-Policy`.

#### Scenario: Non-target hardening on GET /health

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /health`
- THEN the response MUST carry a `Strict-Transport-Security` header containing `max-age`
- AND the `Cross-Origin-Opener-Policy` header MUST equal `same-origin`

#### Scenario: Non-target hardening on GET /api/samples

- GIVEN the API is running with the centralized helmet configuration
- WHEN a client sends `GET /api/samples`
- THEN the response MUST carry a `Strict-Transport-Security` header containing `max-age`
- AND the `Cross-Origin-Opener-Policy` header MUST equal `same-origin`
