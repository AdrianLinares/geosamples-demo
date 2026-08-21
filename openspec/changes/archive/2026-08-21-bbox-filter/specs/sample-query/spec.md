# Delta for sample-query

## ADDED Requirements

### Requirement: Bounding-Box Filter

The system MUST support filtering samples by geographic bounding box via four optional numeric query parameters on `GET /api/samples`: `norteMin`, `norteMax`, `esteMin`, `esteMax`. Coordinates MUST be interpreted in UTM Magna Colombia Bogotá (EPSG:3115), matching the stored `norte`/`este` columns. Bounds MUST be inclusive: `norte >= norteMin`, `norte <= norteMax`, `este >= esteMin`, `este <= esteMax`. Each parameter MUST be independently optional — only present bounds MUST be applied. Present bounds MUST combine with each other and with existing filters using AND semantics. When any bbox bound is present, samples with null `norte` or `este` MUST be excluded.

#### Scenario: North range filter

- GIVEN samples with norte 1000, 1005, 1008, 1010, 1015
- WHEN a query sets `norteMin=1005` and `norteMax=1010`
- THEN only samples with norte 1005, 1008, 1010 are returned (bounds inclusive)

#### Scenario: Single bound only

- GIVEN samples with varying norte values
- WHEN a query sets only `norteMin=1005`
- THEN only samples with `norte >= 1005` are returned, with no upper restriction

#### Scenario: Combines with attribute filters

- GIVEN samples of varying rock types
- WHEN a query filters rock = `Granito` AND sets `esteMin=2000`, `esteMax=2005`
- THEN only Granito samples within that east range are returned

#### Scenario: Null coordinates excluded

- GIVEN a sample with null `norte` and a query with any bbox bound present
- WHEN the query runs
- THEN that sample is not returned

### Requirement: Inverted-Box Validation

When both bounds of a dimension are present, the system MUST reject the request with HTTP 400 and a clear validation message if `norteMin > norteMax` or `esteMin > esteMax`. Validation MUST run before query execution. Requests with only one bound of a dimension MUST NOT trigger this validation.

#### Scenario: Inverted north box rejected

- GIVEN a request with `norteMin=1010` and `norteMax=1005`
- WHEN `GET /api/samples` is called
- THEN the response is HTTP 400 with a message identifying the inverted north range

#### Scenario: Inverted east box rejected

- GIVEN a request with `esteMin=2005` and `esteMax=2000`
- WHEN `GET /api/samples` is called
- THEN the response is HTTP 400 with a message identifying the inverted east range

#### Scenario: Equal bounds accepted

- GIVEN a request with `norteMin=1005` and `norteMax=1005`
- WHEN the query runs
- THEN samples with `norte` exactly 1005 are returned without error

### Requirement: CSV Export Inherits Bounding-Box Filter

`GET /api/samples/export` MUST accept the same four bbox parameters with identical semantics: inclusive bounds, independent optionality, inverted-box 400 rejection, and null-coordinate exclusion. Exported rows MUST be limited to samples matching the bbox.

#### Scenario: Export filtered by bbox

- GIVEN exactly 3 samples within `norteMin=1005` and `norteMax=1010`
- WHEN the export is requested with those parameters
- THEN the CSV contains a header row and exactly those 3 data rows

#### Scenario: Export rejects inverted box

- GIVEN a request with `esteMin=2005` and `esteMax=2000`
- WHEN the export is requested
- THEN the response is HTTP 400, identical to the query endpoint

### Requirement: FilterBar Bounding-Box Inputs

The SPA FilterBar MUST provide four numeric inputs for the bbox bounds. Entered values MUST be serialized into the query string on submit and MUST be emptied on clear. Empty inputs MUST NOT be serialized as parameters.

#### Scenario: Inputs serialized on submit

- GIVEN the FilterBar with `norteMin=1005` and `norteMax=1010` entered
- WHEN the user submits the filter form
- THEN the request query string contains `norteMin=1005` and `norteMax=1010`

#### Scenario: Empty inputs omitted

- GIVEN all four bbox inputs empty
- WHEN the user submits the filter form
- THEN no bbox parameters appear in the query string

#### Scenario: Clear resets bbox inputs

- GIVEN bbox inputs with values
- WHEN the user clears the filters
- THEN all four bbox inputs are emptied and omitted from subsequent queries
