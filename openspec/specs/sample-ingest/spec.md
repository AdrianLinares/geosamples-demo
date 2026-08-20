# Sample Ingest Specification

## Purpose

Defines how the system loads the source dataset (`data/muestras.tsv`) into the catalog: parsing, normalization, canonicalization, and seeding — without ever modifying the source file.

## Requirements

### Requirement: Source Parsing

The system MUST parse `data/muestras.tsv` as tab-separated values with a header row of 20 columns and one record per line. Parsing MUST read the file as UTF-8. The source file MUST NOT be modified, renamed, or deleted by any ingest or registration operation.

#### Scenario: Full file parses

- GIVEN `data/muestras.tsv` with a header and 99 data lines
- WHEN ingest parses the file
- THEN 99 records are produced and none are dropped

#### Scenario: Source file stays immutable

- GIVEN a successful ingest run
- WHEN the source file checksum is compared before and after
- THEN the checksum is unchanged

### Requirement: Value Normalization

Before storage, the system MUST normalize every value: trim surrounding whitespace; fold casing for canonicalization; strip diacritics (accents); remove trailing `?` uncertainty markers; and convert dates from `D/M/YYYY` to ISO `YYYY-MM-DD`. Blank values MUST become null fields, never placeholder text.

#### Scenario: Non-padded date becomes ISO

- GIVEN the raw value `3/11/2019`
- WHEN the value is normalized
- THEN the stored date is `2019-11-03`

#### Scenario: Trailing question mark is stripped

- GIVEN the raw rock name `Ultracataclasita ?`
- WHEN the value is normalized
- THEN the stored value has no trailing `?`

#### Scenario: Blank stays null

- GIVEN an empty `NombreColector` cell
- WHEN the value is normalized
- THEN the stored collector is null

#### Scenario: Blank companion station stays null

- GIVEN an empty `EstacionCompanero` cell
- WHEN the value is normalized
- THEN the stored companion station is null

### Requirement: Canonicalization

The system MUST map normalized rock, collector, and analysis values to canonical entries from the master lists. A value matching a canonical entry case- and accent-insensitively MUST resolve to that entry. Ingest MUST NOT drop a record because a value lacks a canonical match; unresolved values MUST resolve deterministically to a best-effort canonical entry.

#### Scenario: Variant resolves to canonical rock

- GIVEN raw rock values `Cuarzodiorita`, `cuarzodiorita`, and `Roca ígnea, cuarzodiorita`
- WHEN ingest canonicalizes them
- THEN all three resolve to the same canonical rock entry

#### Scenario: Accented collector resolves

- GIVEN raw collectors `Cortés` and `Cortes`
- WHEN ingest canonicalizes them
- THEN both resolve to the same canonical collector entry

### Requirement: Seeding

The system MUST seed the catalog from `data/muestras.tsv`. Seeding SHALL be idempotent: running seed again MUST NOT duplicate records. The seeded canonical rock list MUST contain fewer than 57 entries.

#### Scenario: Seed is idempotent

- GIVEN a catalog already seeded with 99 records
- WHEN seed runs again
- THEN the catalog still holds 99 records

#### Scenario: Rock set shrinks

- GIVEN the 57 raw rock variants in the source
- WHEN seeding completes
- THEN the canonical rock list has fewer than 57 entries
