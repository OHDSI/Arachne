# Arachne DataNode

Arachne DataNode is an open-source platform for distributed clinical data analysis. It enables healthcare organizations to manage observational health data sources, execute standardized analyses, and share results — all while keeping patient-level data local. Built by Odysseus Data Services.

## Tech Stack

**Backend:** Java 17, Spring Boot 3.2.7, PostgreSQL 15.5, Flyway 10, Maven
**Frontend:** React 18, Next.js 16, TypeScript, Tailwind CSS, Redux + Redux Saga
**Infrastructure:** Docker, Amazon Corretto 17, MkDocs (documentation)

## Repository Structure

```
commons/              Shared Java libraries (arachne-commons, common-types, execution-engine-commons)
datanode/             Backend Spring Boot application
datanode-ui/          Frontend Next.js application
docker-runner/        Docker execution runner
install/docker/       Docker Compose deployment configs
docs/                 Documentation and guides
scripts/              Build and test scripts
ExampleStudy/         Example study files
```

## Build & Run Commands

All commands go through the Makefile. Run `make help` for the full list.

### Common Workflows

```bash
make start              # Full stack: Docker Postgres (5434) + backend (8880) + frontend (3000)
make stop               # Kill processes on ports 3000 and 8880
make restart            # Stop then start
make build              # Build everything (Maven, includes frontend)
make clean              # Remove target/ and frontend build artifacts
```

### Backend

```bash
make build-backend      # mvn install -DskipTests -pl datanode -am
make run-backend        # Spring Boot on port 8880 (profiles: local)
make test-backend       # mvn package (skips integration tests)
make test-backend-integration  # With Docker/Testcontainers
```

### Frontend

```bash
make build-datanode-ui  # cd datanode-ui && npm ci && npm run build
make run-datanode-ui    # Next.js dev server on port 3000
make test-datanode-ui   # npm test (Node 20 from .nvmrc)
make unlock-ui          # Clear Next.js dev lock file
```

### Docker

```bash
make run-docker-db      # PostgreSQL only in Docker (port 5434)
make run-docker         # Full Docker Compose stack
```

### Other

```bash
make docs               # MkDocs dev server on http://127.0.0.1:8000
make buildtest          # Full CI build test
make env-test           # Study Repository connection check
make install-test       # Study Repository install test
```

## Architecture

### Backend (datanode/)

Layered Spring Boot application:

- **Controllers** (`controller/`) — REST API endpoints (~64 mapped endpoints)
- **Services** (`service/`) — Business logic
- **Repositories** — Spring Data JPA
- **Entry point:** `com.odysseusinc.arachne.datanode.WebApplicationStarter`
- **Base package:** `com.odysseusinc.arachne.*`
- **Security:** JWT-based auth with Jasypt encrypted properties, role-based access (ROLE_ADMIN)
- **Docker integration:** Communicates with Docker daemon via Unix socket for study execution

### Frontend (datanode-ui/)

- **App router:** `src/app/` (Next.js App Router)
- **API layer:** `src/api/` (Axios HTTP client)
- **State management:** `src/store/` (Redux + Redux Saga)
- **Components:** `src/components/`
- **Study Repository UI:** `src/studyRepository/`
- **API proxy:** `/api/*` requests proxy to `http://localhost:8880` (configurable via PROXY_HOST)
- **Static export:** When `BUILD_STATIC=true`, builds static assets for JAR packaging

## Key Entry Points

| Component | File | Notes |
|-----------|------|-------|
| Backend main | `datanode/src/main/java/com/odysseusinc/arachne/datanode/WebApplicationStarter.java` | @Configuration, @EnableAsync, @EnableScheduling |
| Frontend app | `datanode-ui/src/app/page.tsx` / `layout.tsx` | Next.js App Router entry |
| Frontend config | `datanode-ui/next.config.js` | API proxy, SVGR, static export |
| Parent POM | `pom.xml` | Multi-module: commons, docker-runner, datanode, datanode-ui |

## API Endpoints (Key Controllers)

| Controller | Base Path | Purpose |
|------------|-----------|---------|
| StudyRepositoryController | `/api/v1/study-repository` | Study packages: list, get, install, connection-check |
| AnalysisController | `/api/v1/analysis` | Upload ZIP/files, execute, get details |
| AnalysisResultsController | `/api/v1/analysis/{parentId}/results` | Result download and processing |
| AuthController | `/api/v1/auth/*` | Login, logout, current user (`/me`) |
| BuildNumberController | `/api/v1/build-number` | Health check |
| DataNodeController | `/api/v1/datanode/mode` | DataNode mode |
| DataSourceController | — | Data source management |
| AdminController | — | Admin operations |
| RestartController | `/api/v1/admin/restart` | Application restart |
| LogController | `/api/v1/application/logs/` | Application logs |
| SystemSettingsController | — | System settings |

## Database

- **Engine:** PostgreSQL 15.5
- **Migrations:** Flyway, 65 SQL files in `datanode/src/main/resources/db/migration/`
- **Migration naming:** `V{timestamp}__{description}.sql`
- **Flyway config:** out-of-order enabled, table name `schema_version`, validate-on-migrate disabled
- **Key tables:** users, roles, users_roles, studies, datanode, data_sources, analyses, token_blacklist
- **Dev DB:** localhost:5434 (Docker mapped), database `arachne_datanode`, user `ohdsi-user`

## Testing

### Backend
- **Unit tests:** JUnit (Maven Surefire, excludes TestRunner.java, UploadServiceTest, ValidatorTest)
- **Integration tests:** Testcontainers + Docker (`make test-backend-integration` or `-P integration`)
- **BDD:** Cucumber 7.8.1
- **Test config:** `datanode/src/test/resources/application-test.yml`

### Frontend
- **Runner:** Jest via React Scripts (`npm test`)
- **Libraries:** @testing-library/react, @testing-library/jest-dom
- **Command:** `make test-datanode-ui`

## Configuration

### Backend Config Files (datanode/config/)

| File | Purpose |
|------|---------|
| `config-dev.yml` | Dev profile: DB on localhost:6432, dev users, Jasypt password |
| `config-local.example.yml` | Template for local overrides (copy to `config-local.yml`, git-ignored) |
| `application-local.yml` | Local profile settings |
| `datanode.env.example` | Environment variables template |

### Key Environment Variables

- `PROXY_HOST` — Backend URL for frontend API proxy (default: `http://localhost:8880`)
- `BUILD_STATIC` — Set `true` for static frontend export
- `ARACHNE_DOCKER_REGISTRY_*` — Docker registry for study images
- `JASYPT_ENCRYPTOR_PASSWORD` — Encryption password (dev default: `arachne`)

### Ports (Local Development)

| Service | Port |
|---------|------|
| Frontend (Next.js) | 3000 |
| Backend (Spring Boot) | 8880 |
| PostgreSQL (Docker) | 5434 |
| Backend (Docker Compose) | 8080 |
| MkDocs | 8000 |

## Conventions

- **Java package:** `com.odysseusinc.arachne.datanode.*`
- **Maven coordinates:** `com.odysseusinc.arachne:datanode:2.x-SNAPSHOT`
- **Node version:** 20+ (enforced via `.nvmrc`)
- **Backend JVM args (dev):** `-Xmx1024m`
- **Spring profiles (dev):** `local`
- **Frontend linting:** ESLint on `.ts/.tsx/.js/.jsx` (`npm run lint`)
- **Backend checks:** Maven Checkstyle plugin
- **License:** Apache 2.0
