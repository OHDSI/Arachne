#!/usr/bin/env sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 workers/site1.env" >&2
  exit 1
fi

ENV_FILE="$1"
if [ ! -f "${ENV_FILE}" ]; then
  echo "Worker env file not found: ${ENV_FILE}" >&2
  exit 1
fi

set -a
. "${ENV_FILE}"
set +a

: "${CENTRAL_DATANODE_NAME:?CENTRAL_DATANODE_NAME is required in ${ENV_FILE}}"
: "${DATANODE_URL:?DATANODE_URL is required in ${ENV_FILE}}"

DATANODE_DATASOURCE_ID="${DATANODE_DATASOURCE_ID:-1}" \
DATANODE_LOOKUP_MODE="${DATANODE_LOOKUP_MODE:-api}" \
./federated-worker.sh
