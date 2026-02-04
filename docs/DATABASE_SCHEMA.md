# Arachne Datanode Database Schema

The datanode uses a **single external PostgreSQL database** for all persistent state. Schema is managed by **Flyway**; migrations live under `datanode/src/main/resources/db/migration/`.

## Overview

| Area | Tables | Purpose |
|------|--------|---------|
| **Login / auth** | `users`, `roles`, `users_roles`, `credentials` | User accounts, roles, and stored credentials (BASIC/OIDC). Optional `users.password` for DB auth. |
| **Data sources** | `datasource` | CDM/data source connection configs. |
| **Analyses** | `analyses`, `analysis_state_journal`, `analysis_files`, `analysis_code_files` | Submission/run state, callbacks, results. |
| **Study Repository** | `study_packages`, `study_runs` | Installed studies, script per study, run history and results. |
| **Settings** | `system_settings_groups`, `system_settings` | App config (including `study.catalog.address`, `study.catalog.token`). |
| **Other** | `achilles_jobs`, `token_blacklist`, etc. | Achilles jobs, token blacklist. |

## Study Repository (new)

Designed for the Study Repository UI:

- **study_packages**: One row per installed study (name + version). Holds `script` (e.g. `codeToRun.R`) saved with the study.
- **study_runs**: One row per run; `status` (running/completed/failed/aborted), `result_path`, `logs`. Used to derive “has results” and run history.
- **Settings**: `study.catalog.address` and `study.catalog.token` in `system_settings` (group “Study Repository”).

Login for the UI uses the existing `users` / `credentials` (and optional `users.password` for DB auth).

## Docker

- **Compose**: `install/docker/docker-compose.yml` defines `arachne-datanode-postgres` (Postgres 15, DB `arachne_datanode`, user `ohdsi-user`). The datanode service depends on it and runs Flyway on startup.
- **Env**: `install/docker/datanode.env` sets `spring.datasource.*` to point at that Postgres. From the host, use `localhost:5434` (mapped from container 5432).

## Local dev

For local runs (e.g. `config-dev.yml`), point `spring.datasource.url` (and optional `authenticator.methods.db.config.jdbcUrl`) at your local Postgres. Use the same DB or a separate one; Flyway will apply migrations when the app starts.
