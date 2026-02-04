#!/usr/bin/env bash
# Build and run the full stack: Postgres (Docker), backend (Spring Boot), frontend (Next.js).
# From repo root: ./scripts/run-full-stack.sh  (or: make start)
# Stop with Ctrl+C; backend is killed on exit.

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

BACKEND_PID_FILE="${REPO_ROOT}/.run-backend.pid"
cleanup() {
  if [[ -f "$BACKEND_PID_FILE" ]]; then
    PID=$(cat "$BACKEND_PID_FILE")
    rm -f "$BACKEND_PID_FILE"
    kill "$PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "==> Starting Postgres (Docker)..."
(cd install/docker && docker compose up -d arachne-datanode-postgres)

echo "==> Waiting for Postgres to be ready..."
for i in 1 2 3 4 5 6 7 8 9 10; do
  if docker exec arachne-datanode-postgres pg_isready -U ohdsi-user -d arachne_datanode 2>/dev/null; then
    break
  fi
  sleep 2
done
docker exec arachne-datanode-postgres pg_isready -U ohdsi-user -d arachne_datanode

echo "==> Building backend (skip Docker image build and checkstyle for local run)..."
mvn -q install -DskipTests -DskipDockerBuild=true -Ddockerfile.skip=true -Dcheckstyle.skip=true -pl datanode -am

echo "==> Starting backend on 8880..."
lsof -ti:8880 | xargs kill -9 2>/dev/null || true
sleep 1
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5434/arachne_datanode"
export SPRING_DATASOURCE_USERNAME="ohdsi-user"
export SPRING_DATASOURCE_PASSWORD="ohdsi-password"
(cd datanode && mvn -q spring-boot:run -Dspring-boot.run.profiles=local -Dspring-boot.run.jvmArguments="-Dserver.ssl.enabled=false" -Dcheckstyle.skip=true) &
echo $! > "$BACKEND_PID_FILE"

echo "==> Waiting for backend to listen on 8880..."
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  if nc -z localhost 8880 2>/dev/null; then
    break
  fi
  sleep 2
done
if ! nc -z localhost 8880 2>/dev/null; then
  echo "Backend did not become ready (port 8880 not listening)."
  exit 1
fi

echo "==> Starting frontend (Next.js) on 3000..."
echo "    Open http://localhost:3000  (Ctrl+C to stop backend + frontend)"
export PROXY_HOST="http://localhost:8880"
cd datanode-ui && npm run dev
