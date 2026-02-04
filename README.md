# ARACHNE DataNode v2

[![GitHub release](https://img.shields.io/github/release/OHDSI/Arachne.svg?style=flat-square)](https://github.com/OHDSI/Arachne/releases/latest)

ARACHNE DataNode is an open source web application for executing containerized [OHDSI studies](https://github.com/OHDSI-studies) with a simplified UI. 

---

## Quickstart

### Option A: Full stack (recommended for development)

Runs PostgreSQL in Docker, then the backend and frontend locally. One command:

```bash
make run
```

Then open **http://localhost:3000**. The UI proxies `/api` to the backend on port 8880. Use **Ctrl+C** to stop.

**Prerequisites:**

| Requirement | Version / notes |
|------------|------------------|
| **Java**   | 17               |
| **Maven**  | 3.6+             |
| **Node.js**| 18 (use `nvm use` in `datanode-ui/`; see `.nvmrc`) |
| **Docker** | Running (for Postgres) |

**What `make run` does:**

1. Starts Postgres in Docker (port 5434).
2. Builds the backend (Maven) and runs the Spring Boot datanode on **8880**.
3. Runs the Next.js frontend on **3000** (proxies API to 8880).

**Default login:** `admin` / `ohdsi`

---

### Option B: Docker Compose (Postgres + DataNode)

Run the whole stack in Docker (no local Java/Node build):

1. **Clone and go to the docker install dir:**
   ```bash
   cd install/docker
   ```

2. **Configure (optional):** copy the example env and edit if needed:
   ```bash
   cp datanode.env.example datanode.env
   ```

3. **Start the stack:**
   ```bash
   docker compose up --build
   ```

4. Open **http://localhost:8080**. Default login: **admin** / **ohdsi**.

---

### Option C: Run backend and frontend separately

Useful if you already have Postgres or want to run only one part.

1. **Start Postgres** (if needed):
   ```bash
   make run-docker-db
   ```
   Then point the backend at it (see step 2).

2. **Backend** (from repo root):
   ```bash
   export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5434/arachne_datanode
   export SPRING_DATASOURCE_USERNAME=ohdsi-user
   export SPRING_DATASOURCE_PASSWORD=ohdsi-password
   make run-backend
   ```
   Listens on **8880**.

3. **Frontend** (in another terminal):
   ```bash
   make run-datanode-ui
   ```
   Open **http://localhost:3000** (proxies API to 8880).

---

## Build and test

| Command | Description |
|--------|-------------|
| `make build` | Build backend (Maven; includes datanode-ui in JAR) |
| `make build-datanode-ui` | Build React/Next.js UI only |
| `make test` | Run backend and datanode-ui tests |
| `make test-backend-integration` | Backend tests including integration (needs Docker) |
| `make clean` | Remove Maven `target/` and frontend build artifacts |

---

## Configuration

- **Local backend:** Optional env file `datanode/config/datanode.env` (git-ignored). Copy from `datanode/config/datanode.env.example`. Used for things like Study Repository registry token; can be sourced before `make run-backend`.
- **Docker Compose:** `install/docker/datanode.env` (from `datanode.env.example`) for DB URL, admin user, execution engine, etc.

Schema is managed by **Flyway**; migrations run on backend startup (`datanode/src/main/resources/db/migration/`).

---

## Repository layout

| Path | Description |
|------|-------------|
| **commons** | Shared code and types |
| **datanode** | DataNode backend (Spring Boot) |
| **datanode-ui** | DataNode frontend (React, TypeScript, Next.js) |
| **docker-runner** | Docker-based execution runner |
| **install/docker** | Docker Compose for Postgres + DataNode |
| **docs** | Documentation |

---

## Technologies

| Layer   | Stack |
|---------|--------|
| Backend | Java 17, Spring Boot |
| Frontend| React, TypeScript, Next.js, Webpack |
| UI      | Material UI, Styled Components |

---

## Documentation

- [Deployment with Docker](install/docker/README.md)
- [Analysis preparation](https://github.com/OHDSI/Arachne/wiki/R-Code-Development)
- [R environment](https://github.com/OHDSI/Arachne/wiki/R-Environment-Development)
