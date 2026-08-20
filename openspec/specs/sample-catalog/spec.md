# Sample Catalog Specification

## Purpose

Defines the canonical domain model for geological samples and the master reference lists (rocks, collectors, analysis types) that queries and registration rely on.

## Requirements

### Requirement: Sample Record Model

The system MUST represent each sample with these fields:

| Field | Constraint |
|-------|-----------|
| `IGM` | nullable text |
| `CodigoMuestra` | required, unique |
| `NombreEstacion` | required text |
| `EstacionCompanero` | nullable text |
| `SimboloUG` | nullable text |
| `UGMapa` | nullable text |
| `DescripcionMuestra` | free text |
| `NombreRoca` | required, canonical rock |
| `Localizacion` | text |
| `Plancha` | text |
| `Norte`, `Este`, `Altura` | numeric, nullable |
| `SistemaCoordenadas` | metadata constant |
| `Fecha` | ISO date |
| `Proyecto` | metadata constant |
| `NombreColector` | nullable, canonical collector |
| `ExisteMuestra` | nullable boolean |
| `TipoAnalisis` | canonical analysis type |

The system MUST NOT model the source column `SubUnidad`.

#### Scenario: Complete sample record

- GIVEN a sample with all fields populated
- WHEN the record is read
- THEN every field is returned with its canonical value

#### Scenario: Sparse fields are nullable

- GIVEN a sample with blank `IGM`, `EstacionCompanero`, `NombreColector`, and `ExisteMuestra`
- WHEN the record is read
- THEN those fields are null and the record remains valid

#### Scenario: SubUnidad is not modeled

- GIVEN the list of catalog fields
- WHEN it is inspected
- THEN `SubUnidad` is absent

### Requirement: Master Reference Lists

The system MUST maintain canonical lists of rock types, collectors, and analysis types. Every sample's `NombreRoca`, `NombreColector`, and `TipoAnalisis` MUST reference a canonical entry from the respective list.

The analysis list MUST contain exactly four canonical types: `Seccion Delgada`, `Dataciones Radiometricas`, `Analisis Macro`, and `Bioestratigrafia`.

#### Scenario: Analysis values are canonical

- GIVEN a raw value such as `datacionesradiometricas`
- WHEN the analysis list is consulted
- THEN the sample stores the canonical `Dataciones Radiometricas`

#### Scenario: Rock types reference the list

- GIVEN a raw rock name with multiple variants
- WHEN the sample is read
- THEN `NombreRoca` holds the single canonical entry

### Requirement: Field Invariants

`CodigoMuestra` MUST be unique under case-insensitive comparison. `Fecha` MUST be stored in ISO format (`YYYY-MM-DD`). `SistemaCoordenadas` and `Proyecto` MUST be stored once as metadata rather than varying per record.

#### Scenario: Case-insensitive code identity

- GIVEN an existing sample with code `ACM0398p`
- WHEN a lookup for `ACM0398P` is performed
- THEN the same sample is found

#### Scenario: Constant metadata stored once

- GIVEN all source records share `SistemaCoordenadas` and `Proyecto`
- WHEN the catalog is inspected
- THEN these values are exposed as single metadata constants
