# Docker Runner (Minimal Execution Engine)

A minimal **Docker-only** execution runner for the Arachne Data Node. It implements the same HTTP contract as the full Execution Engine for `/api/v1/analyze`, `/api/v1/abort/{id}`, and `/api/v1/status`, so the Data Node can use it as a drop-in replacement without code changes.

## What it does

- Accepts analysis requests (multipart: `analysisRequest` JSON + zip file) at `POST /api/v1/analyze`.
- Extracts the archive, runs a **Docker container** (default or request-specific image) with the files mounted, executes `Rscript <executableFileName>`.
- Sends status updates and the final result to the Data Node via the callback URLs in the request.
- Supports `POST /api/v1/abort/{id}` and `GET /api/v1/status?id=...` for cancel and status.

## What it does not do

- No SQL execution.
- No tarball R runtimes (only Docker).
- No Hydra/Strategus-specific logic, descriptor scanning, or CDM metadata.

## Build

From the repository root:

```bash
mvn -pl commons/execution-engine-commons,docker-runner -am clean install -DskipTests
```

## Run

```bash
java -jar docker-runner/target/docker-runner-2.x-SNAPSHOT.jar
```

Or with overrides:

```bash
java -jar docker-runner/target/docker-runner-2.x-SNAPSHOT.jar \
  --server.port=8888 \
  --analysis.dir=/tmp/runner-exec \
  --analysis.mount=/tmp/runner-exec \
  --docker.image.default=odysseusinc/r-hades:latest
```

## Configuration

| Property | Default | Description |
|----------|---------|-------------|
| `server.port` | 8888 | HTTP port. |
| `analysis.dir` | /tmp/docker-runner-executions | Directory for extracting request archives (must be writable). |
| `analysis.mount` | same as `analysis.dir` | Host path used as the container bind-mount source; must match the path Docker sees (e.g. same as `analysis.dir` when running on host). |
| `docker.host` | unix:///var/run/docker.sock | Docker host (Unix socket or TCP). |
| `docker.image.default` | r-base | Default image if the request does not specify one. |
| `runtime.timeOutSec` | 259200 | Max container run time (seconds). |
| `runtime.killTimeoutSec` | 30 | Timeout when stopping a container for abort. |
| `submission.updateInterval` | 5000 | Interval (ms) for status callback updates. |

## Pointing the Data Node at the runner

Configure the Data Node so its execution engine client uses the Docker Runner URL instead of the full Execution Engine. In the Data Node config (e.g. `config/config-dev.yml` or env):

- Set the execution engine base URL to the runner (e.g. `http://localhost:8888` or `http://docker-runner:8888` if in Docker).
- The Data Node’s `RemoteExecutionEngineClient` uses this URL for `/api/v1/analyze`, `/api/v1/status`, and `/api/v1/abort/{id}`.

No Data Node code changes are required; only the engine URL configuration.

## Deployment

Run the Docker Runner as a **separate process** (separate JVM or container). The Data Node stays async: it sends the request to the runner and returns; the runner executes in the background and calls back to the Data Node with status and result.

Example with two processes:

1. Start the Docker Runner on port 8888.
2. Start the Data Node with execution engine URL `http://localhost:8888` (or the runner’s host/port in your environment).
