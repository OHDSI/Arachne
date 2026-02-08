#!/usr/bin/env bash
# Run Study Repository install test: pulls darwin-eu-dev/examplestudy from the registry.
# Uses ARACHNE_DOCKER_REGISTRY_* from datanode/config/datanode.env (same as make env-test).
# From repo root: ./scripts/install-test.sh  (or: make install-test)

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Use Unix socket that exists (Linux vs macOS Docker Desktop)
if [[ -S /var/run/docker.sock ]]; then
  export DOCKER_HOST="unix:///var/run/docker.sock"
elif [[ "$(uname -s)" == "Darwin" && -S "$HOME/.docker/run/docker.sock" ]]; then
  export DOCKER_HOST="unix://${HOME}/.docker/run/docker.sock"
else
  export DOCKER_HOST="unix:///var/run/docker.sock"
fi

SOCKET_PATH="${DOCKER_HOST#unix://}"
if [[ ! -S "$SOCKET_PATH" ]]; then
  echo "" >&2
  echo "*** WARNING: Docker host is not available ($SOCKET_PATH not found). Start Docker (e.g. Docker Desktop) or set DOCKER_HOST. Install test will be skipped. ***" >&2
  echo "" >&2
fi

if [[ -f datanode/config/datanode.env ]]; then
  while IFS= read -r line; do
    line="${line%%#*}"
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    if [[ "$line" =~ ^ARACHNE_DOCKER_REGISTRY_[A-Z_]+= ]]; then
      export "$line"
    fi
  done < datanode/config/datanode.env
fi

mvn -q test -pl datanode -Dtest=StudyRepositoryInstallIT -DfailIfNoTests=false
