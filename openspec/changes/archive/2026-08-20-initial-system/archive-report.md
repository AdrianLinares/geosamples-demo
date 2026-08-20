# Archive Report: initial-system

**Change**: initial-system
**Project**: geosamples-demo
**Archived**: 2026-08-20
**Archived to**: `openspec/changes/archive/2026-08-20-initial-system/`
**Archive type**: FULL (all 22/22 implementation tasks complete; no intentional-with-warnings)
**Artifact store mode**: hybrid (filesystem move + Engram persistence)
**reviewGate**: structurally ABSENT — no review was ever started for this candidate; archive proceeded under ordinary repository policy.

---

## Final-State Authority

This report describes the state of the change **AT CLOSE**, governed by the Final-State Authority hierarchy:

1. Native review authority — N/A (`reviewGate` absent).
2. Persisted tasks artifact — filesystem `tasks.md` + Engram obs #17 → **22/22 complete**.
3. **Explicit final-state facts from the orchestrator launch prompt (highest-ranked source for final state)** — outrank the intermediate snapshots below:
   - **Task 5.2 is COMPLETE** (was the only unchecked task). On 2026-08-20 a local PostgreSQL 18 cluster was initialized (`.pgdata/`, gitignored, socket dir `/tmp`, port 5432, role+db `geosamples`) and `pnpm seed` ran LIVE: 99 rows seeded (0 dropped), 42 canonical rocks (<57), 12 collectors, 4 analyses; a second run proved idempotence (counts unchanged). `tasks.md` AND Engram obs #17 now show 22/22 `[x]`.
   - **schema.sql live bug found and fixed**: the original `CONSTRAINT ... UNIQUE (lower(codigo_muestra))` is invalid in PostgreSQL (expression constraints require an index). Fixed to `CREATE UNIQUE INDEX IF NOT EXISTS idx_samples_codigo_muestra_ci ON samples (lower(codigo_muestra));`. Live seed passes with the fix; full suite still 90/90.
   - **Verify verdict**: `verify-report.md` (sha256 `af2c0070d21b9c799e565a59b3c4c5ea3c1cd2f707212ac8bb8fc4612e11a0fe`) = PASS WITH WARNINGS, validator-admitted, 45/45 scenarios COMPLIANT, 90/90 tests. R10 "Seed is idempotent" is now additionally proven with REAL runtime evidence (live second run) beyond the seed-mock.
   - No CRITICAL issues exist anywhere.
4. Intermediate snapshots (lower rank — valid history, NOT current state):
   - Engram **obs #18** (`apply-progress`, written 2026-08-20 10:28): reported 21/22, task 5.2 INFRA-BLOCKED (no reachable PG). **Superseded** by launch-prompt fact (rank 3) + obs #17: 5.2 completed live on 2026-08-20. Not echoed as current state.
   - Engram **obs #19** (`verify-report`, written 2026-08-20 11:12): reported 21/22 tasks complete, 5.2 infra-blocked WARNING, "archive-ready pending user sign-off". The verify *verdict* (PASS WITH WARNINGS, 90/90, 45/45) and the sha256 match the on-disk file and remain authoritative for the verification outcome. The "5.2 incomplete" framing is a snapshot-time statement, now resolved per rank-3 facts.

**No unrankable contradictions**: the launch-prompt facts are corroborated by the on-disk `tasks.md` (22/22, including the 5.2 note) and the live-run note recorded in obs #17.

---

## Spec Sync

**No delta specs existed.** All 6 capabilities were authored directly as FULL specs in `openspec/specs/{admin-auth,sample-catalog,sample-ingest,sample-query,sample-registration,csv-export}/spec.md` during `sdd-spec`. They were already the source of truth. **No filesystem spec sync/merge was required** — there was nothing under `openspec/changes/initial-system/specs/`.

| Domain | Action | Details |
|--------|--------|---------|
| admin-auth | No-op (created earlier in `sdd-spec`) | Full spec already in `openspec/specs/admin-auth/spec.md` |
| sample-catalog | No-op (created earlier in `sdd-spec`) | Full spec already in `openspec/specs/sample-catalog/spec.md` |
| sample-ingest | No-op (created earlier in `sdd-spec`) | Full spec already in `openspec/specs/sample-ingest/spec.md` |
| sample-query | No-op (created earlier in `sdd-spec`) | Full spec already in `openspec/specs/sample-query/spec.md` |
| sample-registration | No-op (created earlier in `sdd-spec`) | Full spec already in `openspec/specs/sample-registration/spec.md` |
| csv-export | No-op (created earlier in `sdd-spec`) | Full spec already in `openspec/specs/csv-export/spec.md` |

---

## Archive Contents (verified)

- proposal.md ✅
- design.md ✅
- tasks.md ✅ (22/22 `[x]`, 0 unchecked)
- verify-report.md ✅ (sha256 `af2c0070…a0fe`, PASS WITH WARNINGS, 90/90, 45/45)
- exploration.md ✅ (no-op archival artifact)
- specs/ — not present (correct; no delta specs)

Active changes directory no longer contains `initial-system` (only `archive/` remains).

---

## Mechanical Copy Verification (MANDATORY readback)

The change folder was moved with a native shell `mv` after a recursive pre-move snapshot (`/tmp/sdd-archive.*/source`). The post-move `diff -r` between the snapshot and the archived folder produced **no output** (exit 0), proving byte-identical archival. `archive-report.md` is additive and was excluded from the comparison (it did not exist in the source snapshot).

Verbatim `diff -r` output:

```text
(no output — empty diff, exit 0 = PASS)
```

---

## Observation IDs Read (traceability)

- Engram **obs #17** — `sdd/initial-system/tasks` (architecture): 22/22 complete, includes live 5.2 run note + schema.sql fix note.
- Engram **obs #18** — `sdd/initial-system/apply-progress` (architecture): intermediate snapshot (21/22, 5.2 infra-blocked) — superseded by rank-3 facts.
- Engram **obs #19** — `sdd/initial-system/verify-report` (architecture): intermediate snapshot (PASS WITH WARNINGS, 21/22) — verdict/sha authoritative, 5.2 framing resolved.

---

## SDD Cycle Complete

The change `initial-system` has been fully planned, implemented, verified, and archived. All 22 tasks complete, no CRITICAL issues, 21 requirements / 45 scenarios compliant, 90/90 tests passing, and live-seed idempotence proven against a real PostgreSQL 18 instance. The 6 capability specs are the source of truth in `openspec/specs/`.

Ready for the next change.
