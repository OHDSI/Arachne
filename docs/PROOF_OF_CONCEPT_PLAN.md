# Study Repository – Proof of Concept Plan

This plan defines what needs to be built to **prove the Study Repository app concept works**, based on [DESIGN_SPECIFICATION.md](DESIGN_SPECIFICATION.md), [V0_STUDY_REPOSITORY_UI_PROMPT.md](V0_STUDY_REPOSITORY_UI_PROMPT.md), [STUDY_REPOSITORY_UI_IMPLEMENTATION_PLAN.md](STUDY_REPOSITORY_UI_IMPLEMENTATION_PLAN.md), and [docs/website/use-case.md](website/use-case.md).

---

## 1. App concept (from spec)

**Study Repository** lets researchers:

1. **Set where studies come from** – Configure study catalog (Docker registry URL) in Settings.
2. **See what’s on the machine** – List installed study packages (name, version, catalog).
3. **Keep studies up to date** – Update a study (pull latest from catalog).
4. **Install a new study** – Enter study name and install (pull from catalog); no upload.
5. **Run a study** – Start study → editor with script (e.g. `codeToRun.R`) → save → run → view log and completion.
6. **Use edits next time** – Script is saved with the study and persists across stop/start.
7. **Look at outputs** – Browse output files (tables, plots) after a run.
8. **View results in an interactive app** – “View results” starts Shiny and provides a URL.
9. **Stop and remove** – Shutdown study (stop container); Delete study (remove from machine) with confirmation.

**Proof of concept** = end-to-end path that demonstrates this flow works: configure catalog → install (or use pre-installed) study → run study (edit script, run R, see log) → see completion → (optional) view results / shutdown / delete.

---

## 2. Current state

### 2.1 Already in place

| Area | Status |
|------|--------|
| **Design & docs** | DESIGN_SPECIFICATION.md, use-case, implementation plan, minimal Docker execution design. |
| **Backend – config & packages** | `StudyRepositoryController`: settings (get/save/check-connection), packages (list, get, install, update script, delete), tags (registry), `POST /packages/{id}/runs` (creates `StudyRun` row only). |
| **Backend – persistence** | `StudyRepositoryPersistenceService`: study_packages, study_runs, catalog settings in system_settings. `StudyRepositoryConnectionService`: registry connection check and list tags. |
| **Backend – schema** | Migration `V20250204000001__study_repository_schema.sql`: `study_packages`, `study_runs`, study_repository system_settings. *(Migration is currently failing at runtime; needs fix or verification.)* |
| **UI** | Study Repository app: `StudyRepositoryApp`, list + install + settings, `study-repository.tsx`, `study-run-view.tsx`, settings page, API client (`api/study-repository.ts`). Wired into app routing. |
| **Execution** | **docker-runner** exists: implements EE contract (`POST /api/v1/analyze`, abort, status), runs Docker container with zip, callbacks to datanode. |

### 2.2 Gaps for proof of concept

| Gap | Description |
|-----|-------------|
| **Migration** | Study repository migration fails on startup; backend may not run. Need to fix or adjust so DB is created and backend starts. |
| **Install = no Docker pull** | “Install” only inserts a row in `study_packages`; it does **not** pull the image from the registry. For PoC: either add real pull, or document “manual pull / use pre-pulled image” and derive image name from package name+version+catalog. |
| **Run = no execution** | `POST /packages/{id}/runs` only creates a `StudyRun` record. Nothing starts a container, runs R, or updates run status/logs. |
| **No run log API** | No endpoint for the UI to fetch run log (e.g. `GET /runs/{id}/log` or `/study-repository/runs/{id}/log`). |
| **No execution → StudyRun link** | When execution runs (via docker-runner or in-datanode), something must update `study_runs` (status, logs, result_path). No callback or service does this today. |
| **No outputs API** | No endpoint to list or download result files for a study run. |
| **No Shiny URL** | No endpoint to start Shiny in container and return URL for “View results”. |
| **No shutdown/stop** | No endpoint to stop the running container for a study run. |

---

## 3. What “prove the concept” means (success criteria)

A minimal proof is achieved when:

1. **Backend starts** – Migration applies; datanode runs without Flyway errors.
2. **Settings & list work** – User can set catalog address and see a list of study packages (even if “install” is DB-only or mock for now).
3. **One full run path** – For at least one study package:
   - User can open “Run this study” and see the script (e.g. `codeToRun.R`) in the editor.
   - User can save the script and trigger “Run study”.
   - A container runs (via docker-runner or equivalent) with that script; log is captured.
   - Run status and log are visible in the UI (polling or stream).
   - On completion, run is marked COMPLETED (or FAILED) and user sees a clear message.
4. **Script persistence** – Script is stored with the study package and reappears on next “Run this study”.

Optional for PoC but desirable:

- **Browse outputs** – List/download result files for a run.
- **View results** – Shiny URL and open in new tab.
- **Shutdown** – Stop the run’s container from the UI.

---

## 4. Phased build plan

### Phase 0: Unblock (backend runs)

| # | Task | Notes |
|---|------|------|
| 0.1 | **Fix or verify study repository migration** | Resolve Flyway failure for `V20250204000001__study_repository_schema.sql` (e.g. fix `ON CONFLICT` or column list, or run against a clean DB). Ensure `study_packages`, `study_runs`, and study_repository system_settings exist. |
| 0.2 | **Smoke-test backend** | Start datanode; call `GET /api/v1/study-repository/settings` and `GET /api/v1/study-repository/packages`; confirm 200 and no errors. |

**Deliverable:** Backend starts; Study Repository settings and package list APIs work.

---

### Phase 1: End-to-end “run study” (core PoC)

Goal: User can run a study and see log + completion, with script persisted.

| # | Task | Notes |
|---|------|------|
| 1.1 | **Map study package → Docker image** | Decide how to get Docker image name from a study package (e.g. `catalogAddress + "/" + name + ":" + version`, or a fixed rule). Add to persistence or config so the runner can resolve image. |
| 1.2 | **Run execution via docker-runner** | When user starts a run (`POST .../packages/{id}/runs`): (1) Create `StudyRun` (already done). (2) Build a zip containing the package’s script as the executable (e.g. `codeToRun.R`) plus any minimal metadata. (3) Build `AnalysisRequestDTO` with callback URLs pointing at datanode and an analysis id that maps to `StudyRun.id` (or a dedicated callback path for study runs). (4) Call docker-runner `POST /api/v1/analyze`. Return run id to UI. |
| 1.3 | **Study-run callback handler** | Implement callback handling that updates `study_runs`: on status updates, append to `logs` and optionally update status; on result callback, set status COMPLETED/FAILED, `result_path`, and final logs. Either extend existing `AnalysisCallbackController` to recognize “study run” requests and delegate to a `StudyRunCallbackHandler`, or add a dedicated callback path that writes to `study_runs`. |
| 1.4 | **Run log API** | Add `GET /api/v1/study-repository/runs/{runId}/log` (and optionally `GET .../runs/{runId}` for status). Return logs for that run (from `study_runs.logs` or equivalent). |
| 1.5 | **UI: run flow and log** | Ensure “Run this study” loads script from package, shows editor, Save (existing PATCH script), and “Run study” calls start run then polls run status/log until completion. Show “Run completed” or “Run failed” and display log in a log viewer. |

**Deliverable:** User can run a study, see live or polled log, and see completion; script is saved with the package.

---

### Phase 2: Install from catalog (optional for PoC)

| # | Task | Notes |
|------|------|------|
| 2.1 | **Docker pull on install** | When user installs a study by name (and optional version): resolve full image name from catalog address + name + version; call Docker API to pull the image; then create `study_packages` row. Requires Docker client in datanode (or a small “study pull” service the datanode calls). |
| 2.2 | **Update = pull latest** | “Update” for a package: pull same image name with `latest` or a chosen tag, then update package version in DB if needed. |

**Deliverable:** Install and Update actually pull images from the configured registry.

*If skipping for PoC:* Document that “Install” is DB-only; for demo, pre-create a package row and ensure the image is already pulled (e.g. ExampleStudy). Map that package to the correct image name in Phase 1.

---

### Phase 3: Outputs, View results, Shutdown (optional for PoC)

| # | Task | Notes |
|------|------|------|
| 3.1 | **List/download result files** | After a run, result files may be in the docker-runner’s extraction dir or in a known path. Add `GET /api/v1/study-repository/runs/{runId}/results/list` and a download endpoint (or reuse analysis results if run is linked to an analysis). UI: “Browse outputs” uses this. |
| 3.2 | **View results (Shiny)** | Backend: start Shiny in the container (e.g. `docker exec` to run `R -e "source('.../codeToRunApp.R')"` or equivalent) and determine the URL (port mapping). Expose `GET or POST /api/v1/study-repository/runs/{runId}/shiny-url`. UI: “View results” calls it and opens URL in new tab. |
| 3.3 | **Shutdown** | Backend: `POST /api/v1/study-repository/runs/{runId}/shutdown` (or sessions/…/shutdown) stops the container used for that run. Requires tracking run id → container id (e.g. in runner callback or in datanode if it starts the container). UI: “Shutdown study” calls it and updates state. |

**Deliverable:** User can browse outputs, open Shiny results, and shutdown the run.

---

## 5. Suggested order and minimal path

- **Minimum to prove concept:** Phase 0 → Phase 1. No real “pull” required if you pre-create one study package and use an already-pulled image (e.g. ExampleStudy).
- **Then:** Phase 2 (real install/update) and/or Phase 3 (outputs, Shiny, shutdown) as needed.

Implementation details (e.g. how to build the zip for docker-runner, exact callback payload for study runs, and whether to reuse `analyses` table or keep only `study_runs`) should follow [STUDY_REPOSITORY_UI_IMPLEMENTATION_PLAN.md](STUDY_REPOSITORY_UI_IMPLEMENTATION_PLAN.md) and [MINIMAL_DOCKER_EXECUTION_DESIGN.md](MINIMAL_DOCKER_EXECUTION_DESIGN.md). The plan above is scoped to “what to build to prove the app concept works” and can be used as a checklist against the existing step-by-step implementation plan.
