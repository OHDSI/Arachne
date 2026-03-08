# Code Review & Hardening Report (2026-03-08)

## Scope

Review and hardening focused on Study Repository production-readiness:

- run lifecycle and output persistence
- Docker dependency behavior
- output and container file read-only viewers
- documentation clarity (user + developer docs)

---

## Findings and fixes

| ID | Finding | Severity | Fix implemented | Impact |
|---|---|---|---|---|
| CR-01 | App could start without a reachable Docker daemon | High | Added startup Docker validation (`StudyImageStartupChecker` + `StudyContainerService.requireDockerAvailable`) with default `datanode.studyRepository.requireDocker=true` | Prevents invalid runtime state and late execution failures |
| CR-02 | Output folder cleanup command accepted unsafe/unvalidated folder input | High | Normalized and validated output folder under `/code`, switched cleanup to safer `mkdir/find` flow | Reduces command/path injection risk and prevents accidental path escape |
| CR-03 | Run could remain inconsistent if cleanup failed before execution | High | Wrapped execute path so cleanup errors mark run `FAILED` and persist final status/logs | Prevents stuck `RUNNING` records and improves operational reliability |
| CR-04 | Result preview in run page could request wrong path (`output/...`) | Medium | Updated file selection key to use persisted file path for API calls | Fixes broken inline preview for result files |
| CR-05 | Result preview extension support inconsistent between pages | Low | Aligned text-like preview extensions in output browser UI and backend (`tsv` + text-like list) | More predictable read-only preview behavior |

---

## TODO list

- [x] Enforce Docker availability at backend startup by default.
- [x] Ensure each run stores a distinct output snapshot, including empty snapshots.
- [x] Clear previous output folder contents before each run and log lifecycle messages.
- [x] Add read-only CSV/text preview in run outputs and container file explorer.
- [x] Clarify run output folder requirements in UI (`/code/<outputFolder>` guidance).
- [x] Add developer docs for architecture/runtime lifecycle and database state schema.
- [x] Update installation/how-to docs for current Docker and output behavior.
- [ ] Add e2e UI test coverage for result-file preview path resolution.
- [ ] Add backend test for startup-fail behavior under an unreachable Docker daemon in Spring context.
- [ ] Introduce retention policy/size guardrails for `study_run_result_files` binary payload growth.

---

## Impact assessment

### Reliability

- Significant improvement: run state transitions are now resilient to pre-execution failures.
- Significant improvement: Docker prerequisite violations fail immediately at startup.

### Security and safety

- Significant improvement: output folder path is constrained to `/code` and cleaned safely.

### Operability

- Significant improvement: run logs explicitly show output clear/save lifecycle.
- Moderate improvement: docs now describe infrastructure and persistence model clearly for support/debugging.

### Developer experience

- Moderate improvement: consistent preview behavior for CSV/text artifacts.
- Moderate improvement: explicit TODO backlog remains for e2e coverage and storage governance.
