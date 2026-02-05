# Arachne DataNode – Design Specification

This document describes the design of **Arachne DataNode**: an open-source web application for executing containerized [OHDSI studies](https://github.com/OHDSI-studies) with a simplified UI. It defines purpose, architecture, components, data model, APIs, and operational constraints.

---

## 1. Purpose and scope

### 1.1 Product vision

Arachne DataNode enables researchers to:

- **Install** study packages from a configurable catalog (Docker registry).
- **Run** studies locally with their own database and settings.
- **View** results in an interactive app (e.g. Shiny).
- **Manage** lifecycle: update, shutdown, and delete studies without dealing with generic uploads or submission workflows.

The primary product surface is the **Study Repository**: a study-centric flow where the user manages Docker study images on their machine and runs them in a controlled environment.

### 1.2 Scope

| In scope | Out of scope |
|----------|---------------|
| Study Repository UI (install, update, run, view results, shutdown, delete) | Full OHDSI Execution Engine (SQL, Hydra, Strategus, tarball runtimes) |
| Minimal Docker-only execution (docker-runner) | Heavy EE dependencies (multiple JDBC drivers, CDM metadata, descriptor scanning) |
| Async execution via callbacks; execution in a separate process | In-process, blocking execution in the datanode JVM |
| Single PostgreSQL database for persistence | Distributed or multi-tenant data stores |
| Configurable study catalog (registry URL + optional token) | Multi-registry or complex catalog federation |

---

## 2. User personas and use cases

### 2.1 Primary persona: researcher running studies

- **Goal:** Run OHDSI studies on their machine with their own database and settings.
- **Needs:** Simple install/run/view/cleanup flow; no uploads or generic “submissions”; persistence of script edits (e.g. `codeToRun.R`) across restarts.

### 2.2 Use cases (summary)

1. **Set where studies come from** – Configure study catalog address (e.g. Docker registry URL) in Settings.
2. **See what’s on the machine** – View list of installed study packages (name, version, catalog link).
3. **Keep studies up to date** – Update a study from the catalog (pull latest image).
4. **Install a new study** – Enter study name and install (pull from catalog); no file picker or upload.
5. **Run a study** – Start study environment → editor with script (e.g. `codeToRun.R`) → save → run study → view log and completion message.
6. **Use edits next time** – Script (DB connection, settings) is saved with the study and persists across stop/start.
7. **Look at outputs** – Browse output files (tables, plots) produced by the study run.
8. **View results in an interactive app** – “View results” starts Shiny (or equivalent) and provides a URL to open in a new tab.
9. **Stop and remove** – Shutdown study (stop container); Delete study (remove from machine) with confirmation.

Detailed user story text is in [docs/website/use-case.md](website/use-case.md).

---

## 3. System architecture

### 3.1 High-level view

```
┌─────────────────────────────────────────────────────────────────┐
│                        User (browser)                            │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  datanode-ui (Next.js / React, TypeScript)                       │
│  – Study Repository UI, Settings, Auth                           │
│  – Proxies /api to backend                                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP (e.g. :3000 → :8880)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  datanode (Spring Boot, Java 17)                                │
│  – REST API, auth, system settings, study repo APIs              │
│  – Analysis orchestration → execution engine client               │
│  – Study packages & runs persistence                             │
└──────────┬──────────────────────────────────┬───────────────────┘
           │                                  │
           │ JDBC                             │ HTTP (analyze, abort, status)
           ▼                                  ▼
┌──────────────────────┐           ┌─────────────────────────────────┐
│  PostgreSQL          │           │  docker-runner (optional)        │
│  – users, analyses,  │           │  – POST /api/v1/analyze           │
│    study_packages,   │           │  – Docker-only execution          │
│    study_runs,       │           │  – Callbacks to datanode          │
│    system_settings   │           │  – Separate JVM/process          │
└──────────────────────┘           └────────────────┬────────────────┘
                                                     │
                                                     │ Docker API
                                                     ▼
                                          ┌──────────────────────┐
                                          │  Docker daemon        │
                                          │  – Study images       │
                                          │  – Running containers │
                                          └──────────────────────┘
```

### 3.2 Design principles

- **Async execution:** The datanode does not block on execution. It sends a request to the execution engine (e.g. docker-runner), returns (e.g. 202), and receives status/results via callbacks.
- **Separate process for execution:** The process that runs Docker (and heavy work) is not the main datanode JVM, so a stuck or crashing run does not block or kill the datanode. See [MINIMAL_DOCKER_EXECUTION_DESIGN.md](MINIMAL_DOCKER_EXECUTION_DESIGN.md).
- **Contract compatibility:** The minimal docker-runner implements the same HTTP contract as the full Execution Engine (`/api/v1/analyze`, `/api/v1/abort/{id}`, `/api/v1/status`) so the datanode can use it as a drop-in replacement via configuration (engine URL).

---

## 4. Components

### 4.1 datanode (backend)

| Responsibility | Description |
|----------------|-------------|
| **REST API** | All application APIs under `/api` (auth, analyses, environments, study repo, admin, system settings). |
| **Authentication** | Users, roles, credentials (BASIC/OIDC); optional DB auth via `users.password`. |
| **Study Repository** | Configuration (catalog/registry URL, token), list/pull study images, study sessions (start container, get/put `codeToRun.R`, run R, log, Shiny URL, shutdown, delete). |
| **Analysis orchestration** | Create analysis, build request (e.g. `AnalysisRequestDTO`) and zip, call execution engine client, handle callbacks (status, result). |
| **Persistence** | Single PostgreSQL database; Flyway migrations; entities for users, analyses, study_packages, study_runs, system_settings. |

**Tech stack:** Java 17, Spring Boot, JPA, Flyway.

**Key packages (conceptual):** `controller`, `service` (including `analysis`, `study`, `client/engine`), `model`, `repository`, `config`, `auth`, `environment`, `datasource`.

### 4.2 datanode-ui (frontend)

| Responsibility | Description |
|----------------|-------------|
| **Study Repository** | Main app surface: list of study packages, install (by name), update, run (editor + log + outputs), view results (Shiny link), shutdown, delete. |
| **Settings** | Study catalog address (and optional token); may use system settings or dedicated study-repo config API. |
| **Auth** | Login, session; private routes. |
| **API proxy** | In dev, proxies `/api` to backend (e.g. port 8880). |

**Tech stack:** React, TypeScript, Next.js, Material UI / custom components (including Study Repository UI with design system from [V0_STUDY_REPOSITORY_UI_PROMPT.md](V0_STUDY_REPOSITORY_UI_PROMPT.md)).

**Structure:** `studyRepository/` (StudyRepositoryApp, components, hooks, types), `libs/` (components, hooks, types, utils), `api/`, `store/`, `app/`.

### 4.3 docker-runner (minimal execution engine)

| Responsibility | Description |
|----------------|-------------|
| **Analyze** | Accept `POST /api/v1/analyze` (multipart: `analysisRequest` JSON + zip); extract archive; run Docker container with files mounted; execute e.g. `Rscript <executableFileName>`; send status and result to datanode callbacks. |
| **Abort / status** | `POST /api/v1/abort/{id}`, `GET /api/v1/status?id=...` for cancel and status. |

**Does not:** SQL execution, tarball runtimes, Hydra/Strategus, CDM metadata, descriptor scanning.

**Deployment:** Separate JVM (or container). Datanode points its execution engine client at the runner URL (e.g. `http://localhost:8888`). See [docker-runner/README.md](../docker-runner/README.md).

### 4.4 Commons

- **arachne-common-types** – Shared types (e.g. `DBMSType`).
- **arachne-commons** – Shared utilities and code.
- **execution-engine-commons** – DTOs and descriptors used by datanode and execution engine (e.g. `AnalysisRequestDTO`, `AnalysisResultDTO`, callback payloads, runtime descriptors).

---

## 5. Data model and persistence

### 5.1 Database

- **Engine:** Single external PostgreSQL database.
- **Management:** Flyway; migrations in `datanode/src/main/resources/db/migration/`.

### 5.2 Main areas (from [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md))

| Area | Tables | Purpose |
|------|--------|---------|
| **Auth** | `users`, `roles`, `users_roles`, `credentials` | Accounts, roles, BASIC/OIDC credentials. |
| **Data sources** | `datasource` | CDM/data source connection configs. |
| **Analyses** | `analyses`, `analysis_state_journal`, `analysis_files`, `analysis_code_files` | Submission/run state, callbacks, results. |
| **Study Repository** | `study_packages`, `study_runs` | Installed studies (name, version, script e.g. `codeToRun.R`), run history (status, result_path, logs). |
| **Settings** | `system_settings_groups`, `system_settings` | App config (e.g. `study.catalog.address`, `study.catalog.token`). |

Study Repository tables support: one row per installed study (with saved script), one row per run (status, result path, logs) for “has results” and run history.

---

## 6. APIs and integration

### 6.1 Execution engine contract (datanode ↔ runner)

The datanode uses the same client interface toward either the full Execution Engine or the docker-runner. The runner implements:

- **POST /api/v1/analyze** – Multipart: `analysisRequest` (JSON, same shape as `AnalysisRequestDTO`) + `file` (zip). Uses `id`, `executableFileName`, `dockerImage` (or config default), `updateStatusCallback`, `resultCallback`, `callbackPassword`.
- **Callbacks:** POST to `updateStatusCallback` with `AnalysisExecutionStatusDTO`; on completion POST to `resultCallback` with multipart `AnalysisResultDTO` + result files. Datanode’s `AnalysisCallbackController` implements these endpoints.
- **POST /api/v1/abort/{id}**, **GET /api/v1/status?id=...** – Cancel and status.

### 6.2 Study Repository APIs (conceptual)

Backend exposes (or will expose) APIs for:

- **Config:** Get/put study catalog address (and optional token) – e.g. via system settings or `/api/v1/study-repo/config`.
- **Images:** List local study images; pull (install); pull by id/name (update).
- **Sessions:** Start study (by image) → session id; get/put file (e.g. `studycode/codeToRun.R`); run script; get log (polling or stream); get Shiny URL; shutdown; delete (container and/or image).

Detailed step-by-step API and UI planning is in [STUDY_REPOSITORY_UI_IMPLEMENTATION_PLAN.md](STUDY_REPOSITORY_UI_IMPLEMENTATION_PLAN.md).

### 6.3 Existing analysis APIs

- Create submission (upload zip/files), analysis lifecycle, `GET /api/v1/analysis/{id}/log`, `GET /api/v1/analysis/{id}/results/list`, file download, `POST /api/v1/analysis/{id}/cancel`. Study runs may reuse these patterns or use dedicated study-session endpoints.

---

## 7. Security and configuration

### 7.1 Authentication

- Users and roles in DB; credentials (BASIC/OIDC) in `credentials`; optional `users.password` for DB auth.
- UI: login, private routes; API protected by same auth.

### 7.2 Configuration

- **Backend:** Optional `datanode/config/datanode.env` (git-ignored); copy from `datanode.env.example`. Used for e.g. Study Repository registry token/URL; source before `make start-backend`. Alternative: `config-local.yml`.
- **Docker Compose:** `install/docker/datanode.env` (from `datanode.env.example`) for DB URL, admin user, execution engine URL, etc.
- **Study catalog:** Configured in UI (Settings) or system settings (`study.catalog.address`, `study.catalog.token`). Backend (or study runner) must have Docker access and, for private registries, credentials.

### 7.3 Registry and images

- Study catalog = Docker registry URL (and optional token). Images are pulled and run on the host where the backend (or runner) has Docker access. Secure registry and image signing (e.g. cosign) are documented in [docs/website/secure-study-repository.md](website/secure-study-repository.md) and [docs/website/security.md](website/security.md).

---

## 8. Deployment and operations

### 8.1 Deployment options

1. **Full stack (dev):** `make start` – Postgres in Docker, backend on 8880, frontend on 3000 (proxies `/api` to 8880). Default login: `admin` / `ohdsi`.
2. **Docker Compose:** `install/docker`: Postgres + DataNode; single entrypoint (e.g. http://localhost:8080).
3. **Split:** Postgres, backend, and frontend can be run separately; backend and frontend can be built independently (`make build`, `make build-datanode-ui`).

### 8.2 Execution engine

- Point datanode’s execution engine base URL at the docker-runner (or full EE). No datanode code change; only configuration. Runner runs as a separate process (separate JVM or container).

### 8.3 Build and test

- `make build` – Backend (Maven; includes datanode-ui in JAR).
- `make build-datanode-ui` – Frontend only.
- `make test` – Backend and datanode-ui tests.
- `make test-backend-integration` – Backend tests including integration (requires Docker).

---

## 9. UI design (Study Repository)

The Study Repository UI follows a defined design system and user flow:

- **Design system:** Colors (e.g. primary `#019cb3`, header `#28393a`, background `#f5f3fa`), layout (left sidebar, top bar, content area), typography (Roboto, 14px body, 24px h1), components (buttons, tables, inputs, chips). Icons: Lucide or Heroicons (folder, gear, download, play, file-text, etc.). See [V0_STUDY_REPOSITORY_UI_PROMPT.md](V0_STUDY_REPOSITORY_UI_PROMPT.md).
- **Structure:** Sidebar (logo, Study Repository, Settings); Study Repository page: install (input + Install), list of studies with actions (Update, Run, View results, Browse outputs, Shutdown, Delete); Run flow: Starting… → Editor (script) → Save → Run study → Log viewer → completion + outputs + View results link. Settings: Study catalog address and Save.

---

## 10. References

| Document | Description |
|----------|-------------|
| [README.md](../README.md) | Quickstart, build, configuration, repository layout. |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | DB tables and Flyway. |
| [MINIMAL_DOCKER_EXECUTION_DESIGN.md](MINIMAL_DOCKER_EXECUTION_DESIGN.md) | Async, separate-process execution; minimal Docker runner. |
| [STUDY_REPOSITORY_UI_IMPLEMENTATION_PLAN.md](STUDY_REPOSITORY_UI_IMPLEMENTATION_PLAN.md) | Step-by-step backend and UI implementation. |
| [V0_STUDY_REPOSITORY_UI_PROMPT.md](V0_STUDY_REPOSITORY_UI_PROMPT.md) | Design system and user story for Study Repository UI. |
| [docs/website/use-case.md](website/use-case.md) | User story and capabilities. |
| [docs/website/installation.md](website/installation.md) | Installation and Study Repository config. |
| [docker-runner/README.md](../docker-runner/README.md) | Docker runner build, run, and configuration. |
| [install/docker/README.md](../install/docker/README.md) | Docker Compose deployment. |

---

*This design specification is intended to be the single high-level reference for Arachne DataNode and the Study Repository. Implementation details and step-by-step plans remain in the referenced documents.*
