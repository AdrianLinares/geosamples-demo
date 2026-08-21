# Delta for Sample Query

## ADDED Requirements

### Requirement: Geographic Bounding Box Filter

The system MUST support filtering samples by a geographic bounding box over the nullable UTM coordinates (`norte`, `este`, Magna Colombia Bogotá) via four optional query parameters: `norteMin`, `norteMax`, `esteMin`, `esteMax`. Each present bound MUST constrain its axis as a closed interval — `norte` within `[norteMin, norteMax]` and `este` within `[esteMin, esteMax]` — with AND semantics across axes and with all other filters. Omitted bounds MUST leave that side of the axis unconstrained, and bounds that do not parse as finite numbers MUST be treated as omitted. When both bounds of an axis are present, `min` greater than `max` MUST be rejected with HTTP 400 and a clear error message identifying the invalid axis. Samples with NULL coordinates MUST NOT match a bounding-box constraint on that axis. Queries without bbox parameters MUST remain geographically unconstrained.

#### Scenario: Full bounding box narrows results

- GIVEN samples distributed across known `norte`/`este` coordinates
- WHEN a query provides all four bounds defining a closed box
- THEN only samples inside the box are returned
- AND samples exactly on the box boundary are included

#### Scenario: Partial bounds leave the omitted axis open

- GIVEN samples with varying coordinates
- WHEN a query provides only `norteMin` and `norteMax`
- THEN samples are filtered on `norte` within the closed interval
- AND no constraint applies to `este`

#### Scenario: Omitted bbox applies no geographic constraint

- GIVEN a catalog with samples at all coordinates
- WHEN a query provides none of the four bbox parameters
- THEN results are not filtered geographically

#### Scenario: Inverted bounds are rejected

- GIVEN a query where `norteMin` is greater than `norteMax`
- WHEN the query runs
- THEN the system responds with HTTP 400 and an error message identifying the invalid axis

#### Scenario: NULL coordinates are excluded

- GIVEN samples with NULL `norte` or NULL `este`
- WHEN a query provides bounding-box bounds
- THEN those samples are excluded from the results
