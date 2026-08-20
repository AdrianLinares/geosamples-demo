# Sample Query Specification

## Purpose

Defines how the system retrieves samples: textual filters across every catalog dimension, case-insensitive matching, free-text search, and paginated results.

## Requirements

### Requirement: Dimension Filters

The system MUST support filtering by: sample code (`CodigoMuestra`), rock type, geological unit (`UGMapa` or `SimboloUG`), collector, analysis type, topographic sheet (`Plancha`), and date range (`Fecha`). Multiple filters MUST combine with AND semantics. All textual filters MUST match case-insensitively; rock, collector, and analysis filters MUST also match accent-insensitively against canonical values.

#### Scenario: Combined filters narrow results

- GIVEN samples with varying rock and unit values
- WHEN a query filters rock = `Granito` AND unit = `Batolito de Santa Marta`
- THEN only samples matching both are returned

#### Scenario: Case-insensitive code filter

- GIVEN an existing sample with code `ACM0398p`
- WHEN a query filters code = `acm0398P`
- THEN that sample is returned

### Requirement: Free-Text Search

The system MUST support free-text search over sample descriptions (`DescripcionMuestra`) and locality (`Localizacion`). Free-text search MUST be case-insensitive.

#### Scenario: Description hit found

- GIVEN a sample whose description mentions `tafoni`
- WHEN a free-text search for `Tafoni` runs
- THEN that sample is returned

#### Scenario: No matches returns empty

- GIVEN a free-text term absent from all records
- WHEN the search runs
- THEN an empty result set is returned, not an error

### Requirement: Pagination

The system MUST return query results paginated, with a configurable page size and a maximum page size. The system MUST return the total number of matching records. Result ordering MUST be deterministic across pages.

#### Scenario: Page traversal is stable

- GIVEN 99 matching records and page size 25
- WHEN pages 1, 2, 3, and 4 are requested
- THEN pages return 25, 25, 25, and 24 records with no overlap

#### Scenario: Total count always present

- GIVEN a query with 40 matches
- WHEN the first page is returned
- THEN the total count is 40

### Requirement: No-Filter Query

The system MUST return the full catalog, paginated, when no filters are applied.

#### Scenario: Empty query lists everything

- GIVEN a catalog of 99 samples
- WHEN a query with no filters is issued
- THEN the first page returns records in deterministic order
