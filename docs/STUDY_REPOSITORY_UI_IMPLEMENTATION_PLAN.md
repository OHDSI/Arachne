# Study Repository UI – Implementation Plan

This document plans UI and backend changes to support a **Study Repository** feature: local Docker study images, install/update from a remote repo, run a study (edit `codeToRun.R`, run R, stream logs), view Shiny results, and shutdown/delete. It is based on the current Arachne datanode and datanode-ui codebase.

**Current architecture (relevant parts):**
- **Environments**: Docker image list comes from the **Execution Engine** via `ExecutionEngineSyncService.checkStatus()` → `EnvironmentDescriptorService.updateDescriptors()`. The UI calls `GET /api/v1/environments` and uses the list in Create Submission (docker image autocomplete). There is no “local study repo” or “pull from registry” in the app today.
- **Submissions/Analysis**: User uploads zip/files + metadata → `AnalysisController` (zip/files) → `AnalysisOrchestrator.run()` → upload stored, analysis record created, request sent to **Execution Engine**. Engine runs the job; callbacks update status. Logs: `GET /api/v1/analysis/{id}/log`. Results: `GET /api/v1/analysis/{id}/results/list` and file download. Cancel: `POST /api/v1/analysis/{id}/cancel`.
- **Docker**: `DockerProperties` (registry host, username, password) is used for Docker client config; the datanode does not expose APIs to list local images or pull. Execution Engine owns the runtime.
- **System settings**: DB tables `system_settings`, `system_settings_groups`; API `GET/POST /api/v1/admin/system-settings`; UI: Admin → System Settings, `useSystemSettings`, `BlockSettings`. Only `integration` is in the whitelist.

The new feature introduces a **study-centric flow** where the datanode (or a dedicated service) manages **study Docker images** locally: list, pull, run container, edit `codeToRun.R` inside the container, run R, stream logs, run Shiny app, shutdown/delete. The plan below assumes the backend will expose new APIs for these operations; the UI is designed to call them.

---

## High-level architecture choices

1. **Study images vs current “environments”**  
   - Keep **Study Repository** as a separate concept: “study images” = Docker images intended for this workflow (downloaded from a configurable repo).  
   - Current “environments” (from Execution Engine) can remain for existing submission flow; Study Repository has its own list and APIs.

2. **Backend ownership**  
   - Either **(A)** datanode gains a new “study repository” module that uses Docker Java API (list images, pull, run container, exec, copy file in/out, stop, remove), or **(B)** a separate “study engine” service does Docker operations and datanode proxies to it.  
   - The plan below uses “backend” to mean whichever component exposes the HTTP APIs; UI stays the same.

3. **Persistence of `codeToRun.R`**  
   - To persist edits across container restarts, the backend must either use a **volume mount** for the studycode directory or **commit/copy** the file into a new image or a named volume. The API contract is: “save codeToRun.R” writes to a place that survives container stop/start.

4. **Reuse of existing analysis/logs/results**  
   - Where possible, reuse existing patterns: e.g. “run study” could create an **Analysis** record and use the same log/result endpoints so the UI can reuse `LogsViewer`, `FileExplorer`, and submission list patterns. Alternatively, study runs could have a separate “study run” entity and dedicated endpoints; the plan below mentions both options.

---

## Step-by-step implementation

---

### Step 1: Backend – Study repo configuration (Docker registry URL)

**Goal:** Persist the “study Docker repo” (registry URL) so the UI can show and edit it.

**Option A – System settings (recommended for consistency):**

- **DB:** Add a system setting for the study registry (e.g. `study.repo.registryUrl`). If you already have a group for docker/registry, add to it; otherwise add a new group (e.g. `study_repo`) and a text setting.
- **Migration:** New Flyway migration: `INSERT` into `system_settings_groups` (if new) and `system_settings` for the registry URL (and optionally username/password if needed).
- **Backend:** No new controller needed; existing `SystemSettingsController` and service already expose GET/POST. Ensure the new setting is in the list returned to the UI (and that the admin UI is allowed to edit it – see Step 2).
- **Files to add/change:**
  - `datanode/src/main/resources/db/migration/VXXXXXXXX__study_repo_system_settings.sql` (new): add group and setting(s) for study repo URL (and optionally auth).
  - No Java changes if using existing system settings; only ensure the new key is not filtered out.

**Option B – Dedicated config endpoint:**

- **New API:** e.g. `GET /api/v1/study-repo/config`, `PUT /api/v1/study-repo/config` with body `{ "registryUrl": "..." }`.
- **Backend:** New `StudyRepoConfigController`, `StudyRepoConfigService`, and a way to store the config (DB table or system_settings under the hood).
- **Files to add:** Controller, Service, DTO, optional DB entity + migration.

**Deliverable:** Backend can store and return the study Docker registry URL (and optional auth). UI will use this in Step 3 for “repo configuration” and install.

---

### Step 2: UI – Repo configuration text box (in app)

**Goal:** User can see and set the Docker repo URL used for the study repository.

**If using system settings (Option A):**

- **Whitelist:** Add the new group (e.g. `study_repo`) to `useSystemSettings.config.ts` → `whitelistSections` so the block appears in System Settings.
- **Navigation:** Admin → System Settings already exists; the new “Study repo” (or “Docker registry”) block will show as another tab/section with a text box for the registry URL.
- **Files to change:**
  - `datanode-ui/src/libs/hooks/useSystemSettings/useSystemSettings.config.ts`: add e.g. `"study_repo"` to `whitelistSections`.
- **Optional:** If the group name in DB doesn’t match a nice label, ensure `BlockSettings` / system settings API returns a human-readable title for the section.

**If using dedicated API (Option B):**

- **New UI:** New page or modal “Study repo configuration” with one (or more) text fields: Registry URL, optionally Username/Password.
- **API module:** New functions, e.g. `getStudyRepoConfig()`, `updateStudyRepoConfig(registryUrl)` in a new `datanode-ui/src/api/studyRepo.ts` (or under `api/studyRepository.ts`).
- **Components:** Reuse existing form components (e.g. `FormElement` + input). On submit, call `updateStudyRepoConfig` and show success/error (e.g. via `useNotifications`).
- **Files to add/change:**
  - `datanode-ui/src/api/studyRepo.ts`: get/update config.
  - Either a new route under Administration or a dedicated “Study repository” section that includes this form (see Step 3).

**Deliverable:** User can open “Study repo configuration” (system settings or dedicated page), see current Docker repo URL, change it, and save.

---

### Step 3: Backend – List local study images and pull/update

**Goal:** Backend can list “study” images on the machine (filtered by repo) and pull/update an image by name.

**Backend:**

- **Docker usage:** Use Docker Java API (or CLI) to:
  - List images (e.g. filter by registry prefix or label “study”).
  - Pull image by name (e.g. `registry.io/myorg/study-name:tag`).
- **APIs:**
  - `GET /api/v1/study-repo/images` → list of local study images, e.g. `[{ "id", "name", "tags", "repo" }]`.
  - `POST /api/v1/study-repo/images/pull` body `{ "image": "study-name" }` or full image name → pull from configured registry; return success/failure.
  - `POST /api/v1/study-repo/images/{imageId}/pull` or `/{imageName}/update` → pull latest for that image (update). Return success/failure.
- **Services:** e.g. `StudyRepoImageService` (list local images, pull, resolve full image name from config + short name). Controller: `StudyRepoController` or `StudyRepositoryController`.
- **Files to add:**
  - `datanode/src/main/java/.../study/StudyRepoController.java` (or under `controller/study/`).
  - `datanode/src/main/java/.../study/StudyRepoImageService.java` (calls Docker API for list/pull).
  - DTOs: e.g. `StudyImageDTO` (id, name, tags, repo), `PullRequestDTO` (image name).
  - If datanode does not yet have a Docker “list/pull” service, add a thin wrapper over `DockerClient` (from existing `DockerConfig`) for listing and pulling images.

**Deliverable:** Frontend can get a list of local study images and trigger “install” (pull) and “update” (pull again) for a given image.

---

### Step 4: UI – Study Repository page (list + install + update)

**Goal:** A “Study Repository” area that shows downloaded images, an “Update” button per image, and an “Install” text box to pull a new study by name.

**Routing and navigation:**

- Add a top-level nav item “Study Repository” (e.g. path `study-repository`).
- **Files to change:**
  - `datanode-ui/src/App.tsx`: New route, e.g. `path="study-repository/*"` → element a new module component (e.g. `IndexStudyRepository`).
  - `datanode-ui/src/components/SideNavigation/SideNavigation.config.ts`: Add `{ title: t("main_menu.study_repository"), name: "study_repository", path: "study-repository", iconName: "library" }` (or re-use “library” / add a new icon).
  - Create `datanode-ui/src/modules/StudyRepository/index.tsx` that renders `<Routes>` and a default route to the main Study Repository page.

**New module – Study Repository list + install:**

- **Page component:** e.g. `StudyRepository/StudyRepositoryPage.tsx` (or `List/StudyRepositoryList.tsx`).
  - **List:** Table or card list of “downloaded study images” from `GET /api/v1/study-repo/images`. Columns: image name, tags, repo (or “source”), actions: **Update** button.
  - **Update button:** Calls `POST /api/v1/study-repo/images/{id}/pull` (or by name). Disable button while request in progress; show success/error toast.
  - **Install section:** Text input (study name or full image name) + “Install” button. On submit, call `POST /api/v1/study-repo/images/pull` with the entered name. Spinner + toast.
- **Repo config:** Link or short block to “Configure Docker repo” that navigates to the repo config (System Settings tab or dedicated page from Step 2).
- **API:** Add in `datanode-ui/src/api/studyRepo.ts`: `getStudyImages()`, `pullStudyImage(name)`, `updateStudyImage(idOrName)`.
- **Types:** e.g. `StudyImageDTO` interface in `datanode-ui/src/libs/types/api/` (id, name, tags, repo).
- **Files to add:**
  - `datanode-ui/src/modules/StudyRepository/index.tsx`
  - `datanode-ui/src/modules/StudyRepository/StudyRepositoryPage.tsx` (or split List + Install form)
  - `datanode-ui/src/api/studyRepo.ts`
  - `datanode-ui/src/libs/types/api/StudyImageDTO.ts` (or in a shared studyRepo types file)
- **Files to change:**
  - `datanode-ui/src/App.tsx` (route)
  - `datanode-ui/src/components/SideNavigation/SideNavigation.config.ts` (nav item)
  - Translations: add keys for “Study Repository”, “Install”, “Update”, “Configure repo”, etc. in `datanode-ui/public/translations/en/translation.json` (and others if needed).

**Deliverable:** User sees Study Repository in the sidebar, opens it, sees list of local study images with Update, and can install a new study by name; can open repo configuration.

---

### Step 5: Backend – Start study container and expose file (codeToRun.R)

**Goal:** “Run this study” starts a container from a study image; backend extracts `studycode/codeToRun.R` and returns content; later (Step 6) backend can write content back.

**Backend:**

- **Start container:** From a chosen study image, run a container (detached or with a long-running command so it stays up). Use a **volume** or bind-mount for the directory that contains `studycode` so that edits to `codeToRun.R` persist (or implement “save” by copying file into container and committing/copying to volume). Record `containerId` (and optionally a “study session” id) in memory or DB.
- **APIs:**
  - `POST /api/v1/study-repo/sessions` or `POST /api/v1/study-repo/run` body `{ "imageId" or "imageName" }` → start container; return `{ "sessionId", "containerId", "status": "starting" }`. Optionally poll until “ready” or provide a separate “ready” endpoint.
  - `GET /api/v1/study-repo/sessions/{sessionId}/file?path=studycode/codeToRun.R` (or fixed path) → read file from container (e.g. `docker cp` or `docker exec cat`), return text content.
- **Services:** e.g. `StudySessionService` or `StudyRunService`: startContainer(image), getFileFromContainer(containerId, path). Store mapping sessionId → containerId (in-memory map or DB table).
- **Files to add:**
  - Session/run controller endpoints (can be in same `StudyRepoController` or a `StudySessionController`).
  - `StudySessionService` (or extend `StudyRepoImageService`): start container, get file content from container.
  - DTOs: `StartStudyRequest`, `StartStudyResponse` (sessionId, containerId, status).

**Deliverable:** Frontend can “start” a study by image; backend returns a session id; frontend can then request `codeToRun.R` content.

---

### Step 6: UI – “Run this study” page (spinner, then codeToRun.R editor)

**Goal:** User clicks “Run this study” for an image → spinner while container boots → then see `codeToRun.R` in an editor to edit (DB connection, study details).

**Flow:**

1. From Study Repository list, add a “Run” (or “Open”) action per image. Navigate to e.g. `/study-repository/run/:imageId` or `/study-repository/session/new?image=...`.
2. **Run study page** component:
   - On mount: call `POST /api/v1/study-repo/sessions` (or run) with selected image. Show **spinner** and “Starting study container…”.
   - Poll `GET /api/v1/study-repo/sessions/{sessionId}/status` (or include status in session response and poll until “ready”), or backend blocks until ready; then fetch `GET /api/v1/study-repo/sessions/{sessionId}/file?path=studycode/codeToRun.R`.
   - Once content is received: render **CodeEditor** (existing component from `libs/components/CodeEditor`) with the content; allow editing. Title: “codeToRun.R”.
   - **Save button:** Call `PUT /api/v1/study-repo/sessions/{sessionId}/file` with body `{ "path": "studycode/codeToRun.R", "content": "..." }` (Step 7). Toast on success. Persistence is guaranteed by backend (volume or copy-back).
   - **Run study button:** Triggers “execute R script” (Step 8). For now, just wire the button to the API that will run the study.
   - Show session id (or study name) in the header so user knows which study/container they’re in.
3. **Routing:** Add route under Study Repository, e.g. `Route path="run/:imageId" element={<RunStudyPage />} />` or `path="session/:sessionId"` if you prefer session-based URL after start.
4. **State:** Keep `sessionId` (and optionally `containerId`) in component state or a small context so the same page can later show “Run study”, “View results”, “Shutdown”, “Browse output” (Steps 9–11).
5. **Files to add:**
   - `datanode-ui/src/modules/StudyRepository/RunStudy/RunStudyPage.tsx` (or `StudyRunPage.tsx`).
   - Optional: `useStudySession` hook to encapsulate start, get file, save file, status polling.
6. **Files to change:**
   - `datanode-ui/src/modules/StudyRepository/index.tsx`: add route for run page.
   - `datanode-ui/src/api/studyRepo.ts`: add `startStudySession(imageId)`, `getStudySessionStatus(sessionId)`, `getStudySessionFile(sessionId, path)`.
   - List page: add “Run” button/link that navigates to run page with image id/name.

**Deliverable:** User can open “Run this study”, see a spinner until the container is ready, then see `codeToRun.R` in the CodeEditor, edit it, and save (once backend supports save in Step 7).

---

### Step 7: Backend – Save codeToRun.R into running container

**Goal:** Persist edited `codeToRun.R` inside the container (so restart keeps changes).

**Backend:**

- **API:** `PUT /api/v1/study-repo/sessions/{sessionId}/file` body `{ "path": "studycode/codeToRun.R", "content": "..." }`. Write content to the file inside the container (e.g. `docker exec` with stdin or `docker cp` from a temp file).
- **Implementation:** Resolve sessionId → containerId; run `docker exec` to write to the path (e.g. `sh -c 'cat > /path/studycode/codeToRun.R'`) or create temp file, `docker cp` into container. Ensure path is the same as the one used when running R later.
- **Files to change:**
  - Same controller/service as Step 5: add `putFileInContainer(sessionId, path, content)` and the PUT endpoint.

**Deliverable:** Frontend “Save” in codeToRun.R editor persists the file in the running container (and, by design of volume/path, across container restarts if you use a volume).

---

### Step 8: Backend – Run R script (source codeToRun.R) and stream log

**Goal:** “Run study” starts an R session in the container, sources `codeToRun.R`; log is streamed to the UI. Reuse existing “analysis” log streaming if the run is represented as an analysis.

**Option A – Reuse analysis + Execution Engine:**

- Create an **Analysis** record and send the “study run” to the Execution Engine (if the engine can “run this container and source this file”). Then use existing `GET /api/v1/analysis/{id}/log` and polling. This requires the engine to support “run in this container and run this script” and to report back to the same callback. Possible but may require engine changes.

**Option B – Study-specific run (recommended for clarity):**

- **Backend:** New endpoint, e.g. `POST /api/v1/study-repo/sessions/{sessionId}/run` → in the container, run `Rscript` or `R -e "source('studycode/codeToRun.R')"` (or the path you use). Capture stdout/stderr and either:
  - Store in DB and expose via `GET /api/v1/study-repo/sessions/{sessionId}/log` (polling), or
  - Stream via SSE/WebSocket to the UI.
- **Persistence:** Run is tied to `sessionId`; optionally create an **Analysis** record and copy log/results there later so “Browse output files” can reuse `AnalysisResultsService` and existing result endpoints. Otherwise, add study-session-specific “result files” API that lists files from a known path inside the container (or from a volume) after the run.
- **Files to add/change:**
  - `StudySessionService`: `runScript(sessionId)` (exec R in container), append log to a buffer or DB.
  - Controller: `POST .../sessions/{sessionId}/run`, `GET .../sessions/{sessionId}/log` (and optionally SSE variant).
  - If you want to reuse result file listing: after run completes, copy result files from container to the same place `AnalysisResultsService` expects, and create/update an Analysis record; then UI can call existing `GET /api/v1/analysis/{id}/results/list`.

**Deliverable:** “Run study” from the UI triggers R in the container; backend provides log (polling or stream). UI can show the same log viewer pattern as current submissions (Step 9).

---

### Step 9: UI – Log streaming and “study finished” notification; browse output

**Goal:** After user clicks “Run study”, show live (or polling) log; when R completes without error, show notification; allow browsing output files.

**UI:**

- **Run study page (same as Step 6):** Add “Run study” button that calls `POST /api/v1/study-repo/sessions/{sessionId}/run`. Then:
  - **Log:** Either use existing `LogsViewer`-style component fed by `GET /api/v1/study-repo/sessions/{sessionId}/log` with polling (e.g. `useStudySessionLog(sessionId)` similar to `useSubmissionLog`), or a new small component that consumes SSE. Show log in a panel below the editor (or in a tab).
  - **Completion:** When backend indicates “finished” (e.g. in status or log response), show **notification**: “Study ran successfully (R script completed without error).”
  - **Browse output:** Add “Browse output files” button. If backend exposes result files via the same `analysis/{id}/results/list` (by linking session to an analysis), reuse `FileExplorer` with that analysis id. Otherwise, add `GET /api/v1/study-repo/sessions/{sessionId}/results/list` and a small file list/download UI (or a simplified FileExplorer that uses this API).
- **Files to add:**
  - `useStudySessionLog.ts` (or extend `useStudySession`) to poll session log.
  - Optional: `StudySessionLogViewer.tsx` (or reuse `LogsViewer` with a different data source).
- **Files to change:**
  - `RunStudyPage.tsx`: wire Run button, log area, completion notification, “Browse output” (and link to file list or modal with file explorer).
  - `api/studyRepo.ts`: add `runStudySession(sessionId)`, `getStudySessionLog(sessionId)`.

**Deliverable:** User runs study, sees log; on success gets a notification and can open output files (reusing or mirroring current submission result file UX).

---

### Step 10: Backend – Run codeToRunApp.R (Shiny) and expose URL

**Goal:** “View results” runs the Shiny app script in the container and returns the URL to open in a browser.

**Backend:**

- **Execution:** In the same container, run `R -e "source('studycode/codeToRunApp.R')"` or whatever starts the Shiny app (likely binding to a port inside the container). Container must expose that port to the host (e.g. `-p 3838:3838` when starting the container) or use a known mapping.
- **API:** `POST /api/v1/study-repo/sessions/{sessionId}/view-results` or `GET .../sessions/{sessionId}/shiny-url` → start Shiny in background (if not already running), return `{ "url": "http://host:port/..." }`. The “host” might be the datanode host or a proxy; port is the one mapped from the container.
- **Files to add/change:**
  - `StudySessionService`: `startShinyApp(sessionId)` (exec in container, detect or configure port), return URL.
  - Controller: endpoint that returns Shiny URL (and optionally “start if not running”).

**Deliverable:** Frontend can request the Shiny URL and show it + open in new window (Step 11).

---

### Step 11: UI – “View results” (Shiny link + new window); Shutdown and Delete

**Goal:** User can click “View results” to get the Shiny URL, open it in a new browser window, and see a “Shutdown study” and “Delete study” button.

**UI:**

- **View results:** Button “View results” on the Run study page (or on a “study session” summary). On click: call backend to get Shiny URL (and start Shiny if needed). Then:
  - Open URL in new window: `window.open(url, '_blank')`.
  - Show the link in the UI (e.g. a copyable text field or “Open Shiny app” link).
- **Shutdown study:** Button “Shutdown study” → call e.g. `POST /api/v1/study-repo/sessions/{sessionId}/shutdown` (backend stops the container). Update UI state to “stopped”; optionally redirect to Study Repository list or keep user on page with a “Start again” option.
- **Delete study:** Button “Delete study” → call e.g. `POST /api/v1/study-repo/sessions/{sessionId}/delete` or `DELETE /api/v1/study-repo/images/{imageId}` (depending on whether “delete” means remove container or remove image). Confirm dialog before delete. Then redirect to Study Repository list or refresh list.
- **API:** Add `getShinyUrl(sessionId)`, `shutdownStudySession(sessionId)`, `deleteStudyImage(imageId)` or `deleteStudySession(sessionId)`.
- **Files to change:**
  - `RunStudyPage.tsx`: add “View results”, “Shutdown study”, “Delete study” buttons; implement open-in-new-window and link display; call shutdown/delete APIs and handle state/redirect.
  - `api/studyRepo.ts`: add the new endpoints.

**Backend (for Shutdown/Delete):**

- **Shutdown:** `POST /api/v1/study-repo/sessions/{sessionId}/shutdown` → stop (and optionally remove) the container; mark session as stopped.
- **Delete:** Clarify semantics: (1) remove container only, or (2) remove container and the image. If (2), endpoint like `DELETE /api/v1/study-repo/images/{imageId}` that stops any container using that image and then removes the image. Implement in `StudySessionService` / `StudyRepoImageService`.

**Deliverable:** User can view Shiny results in a new window, see the link in the UI, shutdown the study container, and delete the study (container and/or image) with clear feedback and navigation.

---

## Summary table – files to add/change by step

| Step | Area | Files to add | Files to change |
|------|------|--------------|------------------|
| 1 | Backend – repo config | Migration for study repo system setting (or new config API) | - |
| 2 | UI – repo config | Optional: `api/studyRepo.ts` (if dedicated API) | `useSystemSettings.config.ts` (whitelist); or new form page |
| 3 | Backend – list/pull images | `StudyRepoController`, `StudyRepoImageService`, DTOs; Docker list/pull wrapper | - |
| 4 | UI – Study Repository page | `modules/StudyRepository/*`, `api/studyRepo.ts`, types | `App.tsx`, `SideNavigation.config.ts`, translations |
| 5 | Backend – start container, get file | Session endpoints, `StudySessionService` (start, getFile) | - |
| 6 | UI – Run study page | `RunStudyPage.tsx`, optional `useStudySession` | `StudyRepository/index.tsx`, `api/studyRepo.ts`, list “Run” link |
| 7 | Backend – save file | PUT file endpoint | `StudySessionService` |
| 8 | Backend – run R, log | POST run, GET log (or SSE) | `StudySessionService` |
| 9 | UI – log + notification + browse | `useStudySessionLog`, optional log/results viewer | `RunStudyPage.tsx`, `api/studyRepo.ts` |
| 10 | Backend – Shiny URL | Shiny start + URL endpoint | `StudySessionService` |
| 11 | UI + Backend – View results, Shutdown, Delete | - | `RunStudyPage.tsx`, `api/studyRepo.ts`; backend shutdown/delete endpoints |

---

## Suggested order of implementation

1. **Backend foundation:** Step 1 (config) → Step 3 (list/pull images) → Step 5 (start container, get file) → Step 7 (save file) → Step 8 (run R, log) → Step 10 (Shiny) + shutdown/delete APIs.  
2. **UI in parallel or after:** Step 2 (repo config) → Step 4 (Study Repository page) → Step 6 (Run study page + editor) → Step 9 (log, notification, browse) → Step 11 (View results, Shutdown, Delete).

This keeps the plan aligned with your existing patterns (system settings, PageList, modals, CodeEditor, LogsViewer, FileExplorer) and makes the new “Study Repository” flow explicit and implementable step by step.
