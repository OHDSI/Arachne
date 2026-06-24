#!/usr/bin/env sh
set -eu

: "${CENTRAL_URL:?Set CENTRAL_URL, for example https://10.0.0.10:8443}"
: "${CENTRAL_DATANODE_NAME:?Set CENTRAL_DATANODE_NAME, for example Site 1 DataNode}"

CENTRAL_DATASOURCE_NAME="${CENTRAL_DATASOURCE_NAME:-${CENTRAL_DATANODE_NAME} Local CDM}" \
CENTRAL_DATANODE_DESCRIPTION="${CENTRAL_DATANODE_DESCRIPTION:-${CENTRAL_DATANODE_NAME}}" \
./register-local-central.sh

echo
echo "Registration complete."
echo "On the Central VM, create a worker env file with:"
echo "  CENTRAL_DATANODE_NAME='${CENTRAL_DATANODE_NAME}'"
echo "  DATANODE_URL='http://THIS_DATANODE_VM_IP:8080'"
echo "  DATANODE_DATASOURCE_ID='1'"
