# Admin Auth Specification

## Purpose

Defines how the system authenticates administrators before granting access to protected operations. Only credentials verified against a configured list of bcrypt password hashes may access protected routes.

## Requirements

### Requirement: Admin Credential Validation

The system MUST validate HTTP Basic credentials (username and password) against the configured administrator accounts, which SHALL be defined in the `ADMIN_USERS` environment variable as username/bcrypt-hash pairs.

The system MUST respond with `401 Unauthorized` and a `WWW-Authenticate: Basic` challenge when credentials are missing or invalid. The response MUST NOT reveal whether the username or the password was the failing part.

#### Scenario: Valid credentials are accepted

- GIVEN an administrator account configured in `ADMIN_USERS` with a bcrypt hash
- WHEN a request presents a valid username and matching password via HTTP Basic
- THEN the request proceeds past authentication

#### Scenario: Missing credentials are rejected

- GIVEN a protected request with no Authorization header
- WHEN the request reaches the system
- THEN the system responds `401` with a `WWW-Authenticate: Basic` challenge

#### Scenario: Invalid password does not leak the failing part

- GIVEN a configured administrator username
- WHEN a request presents that username with a wrong password
- THEN the system responds `401` identically to an unknown-username request

### Requirement: Protected Route Enforcement

The system MUST require valid admin authentication for every sample-registration operation. Unauthenticated or invalid requests MUST be rejected before any operation is performed.

The system MAY also require admin authentication for read and export operations.

#### Scenario: Unauthenticated registration is rejected

- GIVEN no valid admin credentials
- WHEN a request attempts to register a sample
- THEN the system responds `401` and persists nothing

#### Scenario: Authenticated registration is allowed

- GIVEN valid admin credentials
- WHEN a request attempts to register a sample
- THEN the request proceeds to validation

### Requirement: Credential Configuration

The system MUST support multiple administrator accounts in `ADMIN_USERS`. When `ADMIN_USERS` is unset or empty, the system MUST deny all admin operations (fail closed).

#### Scenario: Multiple admins supported

- GIVEN `ADMIN_USERS` lists two accounts
- WHEN either account presents valid credentials
- THEN the request proceeds past authentication

#### Scenario: Empty configuration fails closed

- GIVEN `ADMIN_USERS` unset
- WHEN a request presents any credentials
- THEN the system responds `401` and performs no operation
