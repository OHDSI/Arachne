# Database state

This page documents the Study Repository persistence model in PostgreSQL.

---

## 1. Core tables

## `study_packages`

Installed study images tracked by name and version.

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGSERIAL` | Primary key |
| `name` | `VARCHAR(512)` | Registry repo path (or equivalent study id) |
| `version` | `VARCHAR(128)` | Tag/version |
| `catalog_address` | `VARCHAR(1024)` | Registry base URL used at install |
| `container_id` | `VARCHAR(128)` | Current running container id (nullable) |
| `installed_at`,`created_at`,`updated_at` | `TIMESTAMPTZ` | Audit timestamps |

Constraint: unique `(name, version)`.

## `study_runs`

Execution history per study package.

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGSERIAL` | Primary key |
| `study_package_id` | `BIGINT` FK | References `study_packages.id` |
| `status` | `VARCHAR(32)` | `RUNNING`,`COMPLETED`,`FAILED`,`ABORTED` |
| `started_at`,`finished_at` | `TIMESTAMPTZ` | Run timestamps |
| `result_path` | `VARCHAR(1024)` | Output folder used for this run |
| `logs` | `TEXT` | Combined system + execution logs |
| `docker_image` | `VARCHAR(1024)` | Exact image used for the run |

## `study_run_result_files`

Saved output snapshot for each run.

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGSERIAL` | Primary key |
| `run_id` | `BIGINT` FK | References `study_runs.id` |
| `file_path` | `VARCHAR(2048)` | Path relative to output folder |
| `content` | `BYTEA` | Binary payload |

Constraint: unique `(run_id, file_path)`.

## `study_code_files`

Source of truth for editable run code (`codeToRun.R`).

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGSERIAL` | Primary key |
| `study_package_id` | `BIGINT` FK | References `study_packages.id` |
| `image_tag` | `VARCHAR(128)` | Version/tag scoped code state |
| `path` | `VARCHAR(512)` | Usually `codeToRun.R` |
| `content` | `TEXT` | Script content |
| `version` | `INT` | Optimistic locking counter |
| `created_at`,`updated_at` | `TIMESTAMPTZ` | Audit timestamps |

Constraint: unique `(study_package_id, image_tag, path)`.

## `study_environment_variables`

Environment variables injected into study containers at runtime.

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGSERIAL` | Primary key |
| `name` | `VARCHAR(512)` | Unique variable name |
| `value` | `TEXT` | Stored encrypted at rest |
| `created_at`,`updated_at` | `TIMESTAMPTZ` | Audit timestamps |

## `code_snippets`

Reusable code blocks inserted into scripts from UI.

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGSERIAL` | Primary key |
| `name` | `VARCHAR(128)` | Unique snippet name |
| `description` | `VARCHAR(512)` | Optional |
| `content` | `TEXT` | Snippet text |
| `created_at`,`updated_at` | `TIMESTAMPTZ` | Audit timestamps |

---

## 2. State transitions

## Package state

- Installed: row exists in `study_packages`.
- Loaded: `container_id` points to a currently running container.
- Removed: row deleted (cascades to runs/code/result files).

## Run state

1. Create run row with `status=RUNNING`.
2. Execute script in container.
3. Persist output files for this run id (can be empty).
4. Finalize run with `status`, `result_path`, and logs.

Each run has an isolated result snapshot (`study_run_result_files` keyed by `run_id`), so runs do not overwrite each other.

---

## 3. Migration notes

- Legacy `study_packages.script` storage was removed.
- Current script source of truth is `study_code_files`.
- Migration `V20250301000001__drop_study_packages_script.sql` drops the old column.
