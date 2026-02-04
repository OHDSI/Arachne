# Installation with Docker

This folder contains ARACHNE DataNode deployment scripts for released versions.

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
   




