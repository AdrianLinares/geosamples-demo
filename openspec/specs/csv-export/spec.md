# CSV Export Specification

## Purpose

Defines how the system exports the current query results as a UTF-8 CSV file.

## Requirements

### Requirement: Export of Current Results

The system MUST export every record matching the currently applied filters, independent of page size. The export MUST include a header row with the catalog field names and MUST NOT include a byte-order mark (BOM).

#### Scenario: Filtered export

- GIVEN a query filtered to 5 samples
- WHEN the export is requested
- THEN the CSV contains a header row and exactly 5 data rows

#### Scenario: Export ignores page size

- GIVEN 40 matching records with page size 25
- WHEN the export is requested
- THEN the CSV contains all 40 records

#### Scenario: No BOM emitted

- GIVEN an export of any result set
- WHEN the first bytes are inspected
- THEN they are the header text, not a BOM

### Requirement: Value Formatting

The system MUST render values as CSV text: fields containing commas, double quotes, or newlines MUST be quoted per CSV rules; blank fields MUST be exported as empty cells; numeric values MUST be exported without trailing formatting.

#### Scenario: Special characters escaped

- GIVEN a description containing a comma and a double quote
- WHEN the export is rendered
- THEN the field is quoted and inner quotes are doubled

#### Scenario: Blank fields are empty cells

- GIVEN a record with a null collector
- WHEN the export is rendered
- THEN the collector cell is empty between delimiters

### Requirement: Empty Result Export

The system MUST export a header-only CSV when no records match the current filters.

#### Scenario: No matches still exports

- GIVEN a query with zero matching records
- WHEN the export is requested
- THEN the CSV contains the header row and no data rows
