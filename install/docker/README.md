# Installation with Docker

This folder contains ARACHNE DataNode deployment scripts for released versions.

## Local development (frontend + backend + database)

To run the full stack locally with the UI talking to the backend and the backend using this database:

1. **Start Postgres only** (from repo root):
   ```bash
   make run-docker-db
   ```
   Or from this directory: `docker compose up -d arachne-datanode-postgres`

2. **Start the backend** (from repo root), pointing at Docker Postgres:
   ```bash
   export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5434/arachne_datanode
   export SPRING_DATASOURCE_USERNAME=ohdsi-user
   export SPRING_DATASOURCE_PASSWORD=ohdsi-password
   make run-backend
   ```
   Backend will listen on **8880** (so the frontend proxy can reach it).

3. **Start the frontend** (from repo root):
   ```bash
   make run-datanode-ui
   ```
   Open http://localhost:3000. The Next.js dev server proxies `/api/*` to `http://localhost:8880`.

Flyway runs on backend startup and creates/updates tables (including `study_packages`, `study_runs`, and Study Repository settings).

## Prerequisites 
* Installed Docker 
  * Windows - https://docs.docker.com/desktop/install/windows-install/
  * Linux - https://docs.docker.com/desktop/install/linux-install/
  * Mac - https://docs.docker.com/desktop/install/mac-install/
* Enabled "Hyper-V Windows Features" for Windows systems

### Database (PostgreSQL)
The stack includes an external PostgreSQL service (`arachne-datanode-postgres`) used for:
- **Login / auth**: `users`, `roles`, `users_roles`, `credentials`
- **Analyses**: `analyses`, `analysis_state_journal`, `analysis_files`, `analysis_code_files`
- **Study Repository**: `study_packages`, `study_runs`, and settings under `system_settings`

Schema is managed by **Flyway** (migrations in `datanode/src/main/resources/db/migration/`). Migrations run automatically when the datanode starts. From the host, connect to the DB at `localhost:5434` (user `ohdsi-user`, database `arachne_datanode`).

### Configuration
- Copy `datanode.env.example` to `datanode.env` and adjust (e.g. database URL, credentials). The example file documents backend database and other settings with defaults suitable for the Docker Compose stack.
- If `datanode.env` is missing, docker-compose may use built-in defaults; ensure the database URL and credentials match your PostgreSQL service.

### Deployment steps
1. Clone the repository
2. Navigate to local repository directory `install/docker` in console
3. (Optional) Copy `datanode.env.example` to `datanode.env` and edit as needed
4. Run docker compose command:
```commandline
docker compose -d up
```
5. Open browser and navigate to `http://localhost:8080`
6. The default credentials are:
- Username: admin
- Password: ohdsi
   




