#!/usr/bin/env bash
set -euo pipefail

CENTRAL_URL="${CENTRAL_URL:-https://localhost:8443}"
CENTRAL_USERNAME="${CENTRAL_USERNAME:-admin@odysseusinc.com}"
CENTRAL_PASSWORD="${CENTRAL_PASSWORD:-password}"
CENTRAL_DATANODE_NAME="${CENTRAL_DATANODE_NAME:-Local Docker DataNode}"
CENTRAL_DATASOURCE_NAME="${CENTRAL_DATASOURCE_NAME:-Local CDM}"
CENTRAL_DATANODE_DESCRIPTION="${CENTRAL_DATANODE_DESCRIPTION:-Arachne DataNode}"
DATANODE_DB_CONTAINER="${DATANODE_DB_CONTAINER:-arachne-datanode-postgres}"
DATANODE_LOCAL_DATASOURCE_NAME="${DATANODE_LOCAL_DATASOURCE_NAME:-Local CDM}"
DATANODE_LOCAL_RESULT_SCHEMA="${DATANODE_LOCAL_RESULT_SCHEMA:-results}"

login_response="$(
  curl -kfsS \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"${CENTRAL_USERNAME}\",\"password\":\"${CENTRAL_PASSWORD}\"}" \
    "${CENTRAL_URL}/api/v1/auth/login"
)"
token="$(jq -r '.result.token' <<< "${login_response}")"

data_nodes_response="$(
  curl -kfsS \
    -H "Arachne-Auth-Token: ${token}" \
    "${CENTRAL_URL}/api/v1/data-nodes"
)"
data_node_id="$(jq -r --arg name "${CENTRAL_DATANODE_NAME}" 'if type == "array" then .[]? else .result[]? end | select(.name == $name) | .id' <<< "${data_nodes_response}" | head -n 1)"

if [ -z "${data_node_id}" ]; then
  data_node_payload="$(
    jq -nc \
      --arg name "${CENTRAL_DATANODE_NAME}" \
      --arg description "${CENTRAL_DATANODE_DESCRIPTION}" \
      '{name: $name, description: $description, organization: {name: "OHDSI"}}'
  )"
  data_node_id="$(
    create_data_node_response="$(
      curl -kfsS \
      -H "Arachne-Auth-Token: ${token}" \
      -H 'Content-Type: application/json' \
      -d "${data_node_payload}" \
      "${CENTRAL_URL}/api/v1/data-nodes/manual"
    )"
    jq -r '.centralId' <<< "${create_data_node_response}"
  )"
fi

data_sources_response="$(
  curl -kfsS \
    -H "Arachne-Auth-Token: ${token}" \
    "${CENTRAL_URL}/api/v1/data-nodes/${data_node_id}/data-sources"
)"
data_source_id="$(jq -r --arg name "${CENTRAL_DATASOURCE_NAME}" 'if type == "array" then .[]? else .result[]? end | select(.name == $name) | .id' <<< "${data_sources_response}" | head -n 1)"

if [ -z "${data_source_id}" ]; then
  data_source_payload="$(
    jq -nc \
      --arg name "${CENTRAL_DATASOURCE_NAME}" \
      '{name: $name, modelType: "CDM", dbmsType: "POSTGRESQL", accessType: "PUBLIC", published: false}'
  )"
  data_source_id="$(
    create_data_source_response="$(
      curl -kfsS \
      -H "Arachne-Auth-Token: ${token}" \
      -H 'Content-Type: application/json' \
      -d "${data_source_payload}" \
      "${CENTRAL_URL}/api/v1/data-nodes/${data_node_id}/data-sources"
    )"
    jq -r '.result.id' <<< "${create_data_source_response}"
  )"
fi

if [ -z "${data_source_id}" ] || [ "${data_source_id}" = "null" ]; then
  echo "Could not resolve Central datasource id for [${CENTRAL_DATASOURCE_NAME}]" >&2
  exit 1
fi

docker exec "${DATANODE_DB_CONTAINER}" psql -U ohdsi-user -d arachne_datanode \
  -c "update datasource set central_id = ${data_source_id}, result_schema = '${DATANODE_LOCAL_RESULT_SCHEMA}' where name = '${DATANODE_LOCAL_DATASOURCE_NAME}';"

echo "Central DataNode: ${data_node_id}"
echo "Central DataSource: ${data_source_id}"
echo "Local DataSource: ${DATANODE_LOCAL_DATASOURCE_NAME}"
