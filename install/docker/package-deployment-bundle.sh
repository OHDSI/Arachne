#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
DOCKER_DIR="${ROOT_DIR}/install/docker"
DIST_DIR="${DOCKER_DIR}/dist"
BUNDLE_NAME="${BUNDLE_NAME:-arachne-local-deployment}"
BUNDLE_DIR="${DIST_DIR}/${BUNDLE_NAME}"
ZIP_PATH="${DIST_DIR}/${BUNDLE_NAME}.zip"
TAR_PATH="${DIST_DIR}/${BUNDLE_NAME}.tar.gz"
INCLUDE_UPSTREAM_IMAGES="${INCLUDE_UPSTREAM_IMAGES:-false}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

copy_path() {
  local src="$1"
  local dest="$2"
  if [ -e "${src}" ]; then
    mkdir -p "$(dirname "${dest}")"
    cp -a "${src}" "${dest}"
  fi
}

require_cmd docker
require_cmd tar

mkdir -p "${DIST_DIR}"
rm -rf "${BUNDLE_DIR}" "${ZIP_PATH}" "${TAR_PATH}"
mkdir -p "${BUNDLE_DIR}/images" "${BUNDLE_DIR}/cdm-imports/athena"

copy_path "${DOCKER_DIR}/docker-compose.yml" "${BUNDLE_DIR}/docker-compose.yml"
copy_path "${DOCKER_DIR}/vm/docker-compose.central.yml" "${BUNDLE_DIR}/docker-compose.central.yml"
copy_path "${DOCKER_DIR}/vm/docker-compose.datanode.yml" "${BUNDLE_DIR}/docker-compose.datanode.yml"
copy_path "${DOCKER_DIR}/datanode.env" "${BUNDLE_DIR}/datanode.env"
copy_path "${DOCKER_DIR}/federated-worker.sh" "${BUNDLE_DIR}/federated-worker.sh"
copy_path "${DOCKER_DIR}/register-local-central.sh" "${BUNDLE_DIR}/register-local-central.sh"
copy_path "${DOCKER_DIR}/vm/start-central.sh" "${BUNDLE_DIR}/start-central.sh"
copy_path "${DOCKER_DIR}/vm/start-datanode.sh" "${BUNDLE_DIR}/start-datanode.sh"
copy_path "${DOCKER_DIR}/vm/register-datanode.sh" "${BUNDLE_DIR}/register-datanode.sh"
copy_path "${DOCKER_DIR}/vm/run-worker.sh" "${BUNDLE_DIR}/run-worker.sh"
copy_path "${DOCKER_DIR}/vm/start-workers.sh" "${BUNDLE_DIR}/start-workers.sh"
copy_path "${DOCKER_DIR}/vm/stop-workers.sh" "${BUNDLE_DIR}/stop-workers.sh"
copy_path "${DOCKER_DIR}/vm/workers" "${BUNDLE_DIR}/workers"
copy_path "${DOCKER_DIR}/cdm-db" "${BUNDLE_DIR}/cdm-db"
copy_path "${DOCKER_DIR}/dummy-sql-submission" "${BUNDLE_DIR}/dummy-sql-submission"
copy_path "${DOCKER_DIR}/dummy-sql-submission.zip" "${BUNDLE_DIR}/dummy-sql-submission.zip"
copy_path "${DOCKER_DIR}/client-demo-submissions" "${BUNDLE_DIR}/client-demo-submissions"

chmod +x "${BUNDLE_DIR}/federated-worker.sh" \
  "${BUNDLE_DIR}/register-local-central.sh" \
  "${BUNDLE_DIR}/start-central.sh" \
  "${BUNDLE_DIR}/start-datanode.sh" \
  "${BUNDLE_DIR}/register-datanode.sh" \
  "${BUNDLE_DIR}/run-worker.sh" \
  "${BUNDLE_DIR}/start-workers.sh" \
  "${BUNDLE_DIR}/stop-workers.sh"

cat > "${BUNDLE_DIR}/load-images.sh" <<'SH'
#!/usr/bin/env sh
set -eu

if [ -d images ]; then
  for image in images/*.tar; do
    [ -f "$image" ] || continue
    echo "Loading $image"
    docker load -i "$image"
  done
fi
SH
chmod +x "${BUNDLE_DIR}/load-images.sh"

cat > "${BUNDLE_DIR}/README.md" <<'MD'
# Arachne Local Deployment Bundle

This bundle supports a four-VM deployment:

- one Central VM running Arachne Central CE
- three DataNode VMs, each running one DataNode, one app DB, one execution engine, and one PostgreSQL 16 CDM database container
- one worker process per DataNode, normally run on the Central VM

## Requirements

- Docker Engine or Docker Desktop
- Docker Compose plugin available as `docker compose`
- Linux VM, macOS, or Windows with Docker Desktop/WSL2
- At least 8 GB RAM available to Docker is recommended
- `curl` and `jq` on each VM

## Central VM

Copy this bundle to the Central VM, extract it, then run:

```sh
./start-central.sh
```

Open Central:

```text
https://CENTRAL_VM_IP:8443
```

Default login:

- `admin@odysseusinc.com` / `password`

## DataNode VMs

Copy the same bundle to each DataNode VM, extract it, then run:

```sh
./start-datanode.sh
```

If that VM already has a populated PostgreSQL data directory for the CDM, map it before starting:

```sh
CDM_POSTGRES_DATA=/data/arachne-cdm-postgres ./start-datanode.sh
```

Register each DataNode with Central. Use a unique name on each VM:

```sh
CENTRAL_URL=https://CENTRAL_VM_IP:8443 CENTRAL_DATANODE_NAME="Site 1 DataNode" ./register-datanode.sh
```

Repeat with `Site 2 DataNode` and `Site 3 DataNode` on the other VMs.

DataNode login:

- `admin` / `ohdsi`

## Workers On The Central VM

On the Central VM, copy the worker env examples and fill in the real DataNode VM IPs:

```sh
cp workers/site1.env.example workers/site1.env
cp workers/site2.env.example workers/site2.env
cp workers/site3.env.example workers/site3.env
```

Edit each file:

- `CENTRAL_URL=https://CENTRAL_VM_IP:8443`
- `CENTRAL_DATANODE_NAME` must match the name used during registration
- `DATANODE_URL=http://DATANODE_VM_IP:8080`

Start all configured workers:

```sh
./start-workers.sh
```

Logs are written to `logs/site1.log`, `logs/site2.log`, and `logs/site3.log`.
Stop workers with:

```sh
./stop-workers.sh
```

You can also run a single worker in the foreground:

```sh
./run-worker.sh workers/site1.env
```

## Federated Demo Flow

1. In Central, create a `Custom` analysis.
2. Upload an executable SQL file, or an archive generated by `build-atlas-cohort-analysis.py`.
3. Submit it to one or more registered `Local CDM` datasources.
4. The corresponding worker stages it in the target DataNode as `Pending approval`.
5. In that DataNode, open `Submissions` and approve or reject it.
6. If approved, DataNode executes locally against its own CDM Postgres data.
7. The worker uploads result files back to Central.

## CDM Database

Each DataNode VM owns its own CDM Postgres data.

By default, Docker creates a named volume called `arachne-cdm-pg-data`. To map a
specific host directory instead, set `CDM_POSTGRES_DATA` before starting:

```sh
CDM_POSTGRES_DATA=/data/arachne-cdm-postgres ./start-datanode.sh
```

Connection details:

- Host from host machine: `127.0.0.1`
- Port: `5435`
- Database: `cdm54`
- Schema: `omop`
- Username: `cdm-user`
- Password: `cdm-password`

## Reset Everything

This deletes local Docker volumes for this compose project:

```sh
docker compose -f docker-compose.datanode.yml down -v
docker compose -f docker-compose.central.yml down -v
```

## Notes

- CDM database contents are not included in this bundle.
- Central uses a self-signed HTTPS endpoint locally, so browsers may warn on first visit.
MD

echo "Saving local DataNode image"
docker image inspect arachne-datanode-local >/dev/null
docker save -o "${BUNDLE_DIR}/images/arachne-datanode-local.tar" arachne-datanode-local

echo "Saving local CDM Postgres image"
docker image inspect arachne-cdm-postgres:local >/dev/null
docker save -o "${BUNDLE_DIR}/images/arachne-cdm-postgres-local.tar" arachne-cdm-postgres:local

if [ "${INCLUDE_UPSTREAM_IMAGES}" = "true" ]; then
  echo "Saving upstream images"
  docker pull postgres:15.5-alpine
  docker pull odysseusinc/execution_engine:2.7.1
  docker pull odysseusinc/arachne-central-ce:latest
  docker pull odysseusinc/r-hades:latest
  docker save -o "${BUNDLE_DIR}/images/postgres-15.5-alpine.tar" postgres:15.5-alpine
  docker save -o "${BUNDLE_DIR}/images/execution_engine-2.7.1.tar" odysseusinc/execution_engine:2.7.1
  docker save -o "${BUNDLE_DIR}/images/arachne-central-ce-latest.tar" odysseusinc/arachne-central-ce:latest
  docker save -o "${BUNDLE_DIR}/images/r-hades-latest.tar" odysseusinc/r-hades:latest
fi

find "${BUNDLE_DIR}" -name '*:Zone.Identifier*' -delete
find "${BUNDLE_DIR}" -name '.DS_Store' -delete
find "${BUNDLE_DIR}" -type f \( -name '*.dump' -o -name 'omop_cdm.zip' -o -name 'vocab.zip' \) -delete

if command -v zip >/dev/null 2>&1; then
  (
    cd "${DIST_DIR}"
    zip -qr "${ZIP_PATH}" "${BUNDLE_NAME}"
  )
  echo "Created ${ZIP_PATH}"
else
  (
    cd "${DIST_DIR}"
    tar -czf "${TAR_PATH}" "${BUNDLE_NAME}"
  )
  echo "Created ${TAR_PATH}"
fi
