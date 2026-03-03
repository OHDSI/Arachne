# Code Review Findings (2026-03-01)

## Summary

This review focused on build/test tooling and the Study Repository execution path, because those areas directly affect local developer workflow and runtime correctness.

The codebase is currently passing `make test`, including:

- backend Maven package + unit tests
- frontend `npm test -- --watchAll=false`

## Findings

### Fixed

- [x] `make unlock-ui` was documented but not implemented.
  - Root cause: `Makefile` exposed `unlock-ui` in `.PHONY` and help text, but the real target name was `flush`.
  - Fix: renamed the target to `unlock-ui` and kept `flush` as a compatibility alias.
  - Impact: Medium. The documented recovery workflow for clearing the Next.js lock file was broken.

- [x] `scripts/install-test.sh` claimed it would skip when Docker was unavailable, but still ran Maven.
  - Root cause: the script only printed a warning when the Docker socket was missing.
  - Fix: exit early with success after the warning.
  - Impact: Medium. Local verification could fail spuriously on machines where Docker was intentionally not running.

- [x] Study execution paths could use stale script content from `StudyPackage.script` instead of the DB-backed `codeToRun.R`.
  - Root cause: `StudyRepositoryController` still used the legacy `StudyPackage.script` field in `startShiny` and as the fallback in `executeStudy`.
  - Fix: both paths now resolve script content from `CodeFileService` first and only fall back to the legacy field if the code-file lookup fails.
  - Impact: High. Shiny could point at the wrong output folder, and API callers omitting `script` in `execute` could run outdated code.

- [x] The legacy `StudyPackage.script` field drifted behind the DB-backed code file after autosave updates.
  - Root cause: `PUT /packages/{id}/codeToRun` updated only the code-file table.
  - Fix: the controller now mirrors successful `codeToRun` updates into `StudyPackage.script`.
  - Impact: Medium. This reduced internal state divergence and keeps legacy readers more accurate.

- [x] Missing regression coverage for the stale-script path.
  - Fix: added a controller unit test proving `startShiny` prefers the DB-backed script over `StudyPackage.script`.
  - Impact: Medium. Prevents silent reintroduction of the same bug.

- [x] The frontend and package DTO still depended on the legacy `script` field.
  - Root cause: the package list API exposed `script`, and the UI refreshed package state through a separate `updateStudyPackageScript` path.
  - Fix: the UI now relies on `codeToRun` APIs for edits, the package DTO no longer exposes `script`, and the legacy `/script` endpoint is now only a compatibility shim over `CodeFileService`.
  - Impact: High. This removes the main remaining API-level split-brain around script state.

- [x] `executeStudy` lacked regression coverage for the null-body fallback path.
  - Fix: added a controller unit test proving `executeStudy` resolves the script from `CodeFileService` when the request omits `script`.
  - Impact: Medium. This closes the most important remaining backend test gap around the stale-script bug.

- [x] Frontend tests emitted React Router future-flag warnings.
  - Fix: enabled the relevant future flags in the test router setup.
  - Impact: Low. Test output is now cleaner and more signal-heavy.

### Remaining Improvements

- [x] Remove the legacy `study_packages.script` column entirely.
  - Fix: removed the entity field and write-through path, and added a Flyway migration to drop the column from existing databases.
  - Impact: Medium. The Study Repository now has a single persisted source of truth for script content.

- [x] Fail fast when Docker is unavailable for Study Repository shell tests.
  - Fix: `env-test.sh` and `install-test.sh` now both exit with an error when no usable Docker socket is present.
  - Impact: Medium. This matches the actual runtime requirement and prevents misleading partial checks.

## To-Do List

- [x] Repair the documented `unlock-ui` make target.
- [x] Make `install-test.sh` actually skip when Docker is unavailable.
- [x] Route Shiny startup through the DB-backed script source of truth.
- [x] Keep `StudyPackage.script` synchronized after `codeToRun` updates.
- [x] Add a regression test for the stale-script bug.
- [x] Remove UI/API dependency on the legacy package `script` field.
- [x] Add controller coverage for `executeStudy` fallback.
- [x] Clean up React Router warnings in frontend tests.
- [x] Remove the legacy `study_packages.script` storage entirely.
- [x] Decide whether `env-test.sh` should skip or fail when Docker is absent, and document that behavior explicitly.

## Verification Notes

- `mvn -q -pl datanode -Dtest=StudyRepositoryControllerTest test` passed.
- `make test` passed.
- No integration-test profile was run, so Docker/Testcontainers integration paths were not re-validated beyond existing unit coverage.
