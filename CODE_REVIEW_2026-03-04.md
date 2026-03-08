# Code Review Findings (2026-03-04)

## Scope

This review focused on the Study Repository runtime path, local developer workflow, and the current frontend/backend tooling around the modified install flow.

## Findings

### 1. High: selected study versions can silently run the wrong Docker image

- `StudyRepositoryController.startStudy()` computes the requested image tag, but then immediately falls back to `containerService.resolveLocalImageName(imageName)` when that exact tag is missing.
- `toDTO()` also reports `imageInstalled=true` when any tag from the same repository exists locally, not when the selected `repo:tag` exists.
- In practice, selecting version `main` can still launch `1.0.0` (or any other locally cached tag) with no hard failure, which makes the version selector unreliable and can invalidate results.
- Recommended fix: require an exact `repo:tag` match when starting a study, and surface a refresh/install error instead of silently substituting another tag.

References:
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:295`
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:667`
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/study/StudyContainerService.java:300`
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/study/StudyContainerService.java:315`

### 2. High: `repo:tag` parsing misinterprets names that already contain a colon

- The new install parser in both the frontend and backend splits on the last `:` whenever `version` is omitted.
- That works for simple `repo:tag` inputs, but it breaks valid references such as `localhost:5000/team/study` (registry host with port, no tag) and digest-style references like `repo@sha256:...`.
- Example: `localhost:5000/team/study` becomes `name=localhost` and `version=5000/team/study`, which then produces an invalid pull request.
- Recommended fix: only treat a colon as a tag separator when it appears after the last `/` and the reference is not digest-based (`@sha256:`), or use a Docker-reference parser instead of ad hoc string slicing.

References:
- `datanode-ui/src/api/study-repository.ts:36`
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryController.java:104`

### 3. High: local startup now rewrites Flyway history on every run and hides failures

- `scripts/run-full-stack.sh` unconditionally runs `mvn flyway:repair` before starting the backend.
- `flyway:repair` mutates `flyway_schema_history`; using it automatically on every developer startup masks migration drift instead of forcing the drift to be fixed.
- The command is also hardcoded to `localhost:5434` with the default credentials and is wrapped in `|| true`, so custom local DB settings will either repair the wrong database or fail silently.
- Recommended fix: remove the automatic repair step, or gate it behind an explicit opt-in command such as `make repair-flyway`.

References:
- `scripts/run-full-stack.sh:35`

### 4. Medium: Shiny port assignment will collide once package IDs exceed 1000

- Container startup binds the Shiny port to `SHINY_PORT_BASE + (packageId % 1000)`.
- That means package IDs `1` and `1001` both map to the same host port, package IDs `2` and `1002` collide, and so on.
- In a long-lived database this will eventually cause container start failures or users being sent to the wrong app instance.
- Recommended fix: allocate ports without modulo reuse, or let Docker assign an ephemeral host port and persist the chosen port with the running package.

References:
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/study/StudyContainerService.java:185`
- `datanode/src/main/java/com/odysseusinc/arachne/datanode/service/study/StudyContainerService.java:201`

### 5. Medium: `npm run lint` is broken in the current frontend configuration

- Running `npm run lint` currently exits with `TypeError: Converting circular structure to JSON` while loading the ESLint config.
- The failure occurs before any source files are checked, so the advertised lint command is not usable as a guardrail in local development or CI.
- The most likely cause is the current combination of legacy `.eslintrc.js` config (`next/core-web-vitals`) with `eslint-config-next` `16.1.6` and `eslint` `8.56.0`.
- Recommended fix: align the ESLint stack to one supported mode (either migrate to the Next 16/ESLint 9 flat-config path, or pin Next ESLint tooling to a version that still supports this legacy config model).

References:
- `datanode-ui/.eslintrc.js:23`
- `datanode-ui/package.json:120`
- `datanode-ui/package.json:132`

### 6. Low: Node version guidance is inconsistent across the repo

- The frontend package requires Node `>=20.9` and `.nvmrc` is `20`.
- The top-level README and Makefile still instruct developers to use Node 18.
- This creates avoidable setup churn: a developer following the docs can install the wrong runtime before hitting engine or dependency issues.
- Recommended fix: update all developer-facing guidance to match the actual supported Node version.

References:
- `README.md:25`
- `Makefile:32`
- `Makefile:132`
- `datanode-ui/package.json:5`
- `datanode-ui/.nvmrc:1`

## Testing Gaps

- `StudyRepositoryControllerTest` currently covers only the Shiny-start and execute paths; it does not exercise the install parser, version-selection fallback, or image-tag resolution edge cases.
- I did not find a frontend test covering `parseStudyInstallInput()` or the install-form parsing behavior.

References:
- `datanode/src/test/java/com/odysseusinc/arachne/datanode/controller/study/StudyRepositoryControllerTest.java:65`
- `datanode-ui/src/api/study-repository.ts:40`

## Verification Notes

- `mvn -q -pl datanode -Dtest=StudyRepositoryControllerTest -Dcheckstyle.skip=true test` passed.
- `npm run lint` failed with the ESLint circular-structure error described above.
- I did not run the full integration suite, so Docker/Testcontainers paths were reviewed statically unless noted otherwise.
