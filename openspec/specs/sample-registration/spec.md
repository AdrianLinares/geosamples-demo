# Sample Registration Specification

## Purpose

Defines how administrators create new samples: authenticated submission, validation, case-insensitive uniqueness, and append-only persistence.

## Requirements

### Requirement: Authenticated Creation

The system MUST require valid admin credentials for every registration request. A request without valid credentials MUST be rejected with `401` and MUST NOT create any record.

#### Scenario: Unauthenticated request rejected

- GIVEN no valid admin credentials
- WHEN a registration request is submitted
- THEN the system responds `401` and creates nothing

#### Scenario: Authenticated request proceeds

- GIVEN valid admin credentials and a well-formed payload
- WHEN the registration request is submitted
- THEN the system validates and stores the sample

### Requirement: Registration Validation

The system MUST reject registration with `400` when required fields are missing or malformed. Required fields: `CodigoMuestra`, `NombreEstacion`, `NombreRoca`. `Fecha` MUST be a parseable ISO date; `Norte`, `Este`, and `Altura` MUST be numeric when provided; rock, collector, and analysis values MUST be canonicalizable to a master-list entry.

#### Scenario: Missing required field rejected

- GIVEN a payload without `NombreRoca`
- WHEN the registration is submitted
- THEN the system responds `400` and creates nothing

#### Scenario: Malformed date rejected

- GIVEN a payload with `Fecha` = `not-a-date`
- WHEN the registration is submitted
- THEN the system responds `400`

#### Scenario: Unknown analysis type rejected

- GIVEN a payload with an analysis value outside the four canonical types
- WHEN the registration is submitted
- THEN the system responds `400`

### Requirement: Code Uniqueness

The system MUST reject a registration whose `CodigoMuestra` already exists under case-insensitive comparison, responding with `409`.

#### Scenario: Duplicate code rejected

- GIVEN an existing sample with code `ACM0398p`
- WHEN a registration submits code `ACM0398P`
- THEN the system responds `409` and creates nothing

#### Scenario: New code accepted

- GIVEN no existing sample with code `ZZX9999`
- WHEN a registration submits code `ZZX9999`
- THEN the sample is created

### Requirement: Append-Only Persistence

Registration MUST add new records only. The system MUST NOT modify or delete existing records as a result of registration, and MUST NOT alter the source TSV file.

#### Scenario: Existing records untouched

- GIVEN 99 existing samples
- WHEN one new sample is registered
- THEN the catalog holds 100 samples and the original 99 are unchanged
