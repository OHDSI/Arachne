#!/usr/bin/env bash
# Run Study Repository install test: pulls darwin-eu-dev/examplestudy from the registry.
# Uses ARACHNE_DOCKER_REGISTRY_* from datanode/config/datanode.env (same as make env-test).
# From repo root: ./scripts/install-test.sh  (or: make install-test)

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

export DOCKER_HOST="unix:///var/run/docker.sock"

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
