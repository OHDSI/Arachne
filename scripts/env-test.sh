#!/usr/bin/env bash
# Run Study Repository connection check (same as UI "Check connection" button) with ARACHNE_DOCKER_REGISTRY_* from datanode/config/datanode.env.
# Exports only those variables so other lines (e.g. curl examples) are not executed.
# From repo root: ./scripts/env-test.sh  (or: make env-test)

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

if [[ -f datanode/config/datanode.env ]]; then
  while IFS= read -r line; do
    line="${line%%#*}"   # strip inline comment
    line="${line#"${line%%[![:space:]]*}"}"   # trim leading space
    line="${line%"${line##*[![:space:]]}"}"   # trim trailing space
    if [[ "$line" =~ ^ARACHNE_DOCKER_REGISTRY_[A-Z_]+= ]]; then
      export "$line"
    fi
  done < datanode/config/datanode.env
fi

mvn -q test -pl datanode -Dtest=StudyRepositoryConnectionServiceIT -DfailIfNoTests=false
