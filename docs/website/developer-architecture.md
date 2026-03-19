# Developer architecture

This page is a technical reference for how Arachne runs studies in production: core services, runtime dependencies, and Docker image/container lifecycle.

---

## 1. Runtime components

| Component | Responsibility | Runtime dependency |
|---|---|---|
| `datanode-ui` (Next.js static build) | Study Repository UI: install/run/outputs/settings | Browser + datanode API |
| `datanode` (Spring Boot) | API, persistence, run orchestration, Docker API calls | PostgreSQL + Docker daemon |
| PostgreSQL | System settings, study package state, run history, result files, code files | Persistent storage |
| Docker daemon | Pull study images, run study containers, expose container filesystem and logs | Host-level Docker access |

The backend is not optional for execution: if Docker is unavailable, startup fails fast by default (`datanode.studyRepository.requireDocker=true`).

---

## 2. End-to-end flow

## Install flow

1. UI calls `POST /api/v1/study-repository/packages`.
2. Backend resolves `name:version`, authenticates to registry, pulls image.
3. Backend persists `study_packages` row.

## Open study flow

1. UI calls `POST /packages/{id}/start`.
2. Backend starts or reuses a container (`tail -f /dev/null` keepalive).
3. Backend resolves code from `study_code_files` (or seeds it), syncs to `/workspace/codeToRun.R`.

## Run flow

1. UI calls `POST /packages/{id}/execute`.
2. Backend parses `outputFolder` from script and clears `/code/<outputFolder>` before execution.
3. Backend runs script in container.
4. Backend copies `/code/<outputFolder>` from container, extracts files, stores files per run.
5. Backend stores run status/logs and the output folder path in `study_runs`.

## Browse outputs flow

1. UI calls `GET /packages/{id}/runs`.
2. UI calls `GET /runs/{runId}/result-files`.
3. For preview, UI calls `GET /runs/{runId}/result-files/preview` (read-only CSV/text).
4. For download, UI calls `GET /runs/{runId}/result-files/download`.

## View results flow

1. UI calls `POST /packages/{id}/shiny/start`.
2. Backend finds the latest completed run that has persisted result files.
3. Backend starts or reuses the study container.
4. Backend restores the saved output snapshot back into the run's saved `resultPath`.
5. Backend launches the Shiny viewer against that restored folder and returns the host URL.

---

## 3. Docker image and container lifecycle

## Image lifecycle

1. A study image is published in a Docker registry.
2. Install/refresh pulls the image to host Docker.
3. Backend marks `imageInstalled=true` when image is present locally.

## Container lifecycle

1. `start` creates container from the selected study image.
2. Container runs idle (`tail -f /dev/null`) so code can be edited/executed repeatedly.
3. `execute` runs script in the same container and captures outputs.
4. `stop` stops and removes the running container reference for the package.
5. `delete package` also stops any running container.

## Output lifecycle per run

1. Determine output folder from script (`outputFolder`, default `output`).
2. Clear prior files from `/code/<outputFolder>`.
3. Execute script.
4. Copy output folder to backend and persist files under current run id.
5. Store run logs with system messages indicating clear/save behavior.
6. When Shiny is launched later, restore the saved files back into the container output path before starting the viewer.

Because each run writes under a distinct `study_runs.id`, every run has an independent saved output snapshot (possibly empty).

---

## 4. API preview behavior (read-only)

Inline file preview is intentionally read-only:

- Result preview: `GET /packages/{packageId}/runs/{runId}/result-files/preview`
- Container preview: `GET /packages/{id}/container-files/preview`

Both preview endpoints:

- support CSV/text-like files only
- enforce size limits and return `truncated` when content is cut
- do not expose any write path

---

## 5. Production checklist

- Docker daemon is reachable from datanode host.
- PostgreSQL persistence is backed up.
- Registry credentials are configured and rotated.
- `make test` passes in CI.
- Study images are signed/scanned (see secure-study-repository page).
