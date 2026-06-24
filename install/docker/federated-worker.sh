#!/usr/bin/env bash
set -euo pipefail

CENTRAL_URL="${CENTRAL_URL:-https://127.0.0.1:8443}"
CENTRAL_USERNAME="${CENTRAL_USERNAME:-admin@odysseusinc.com}"
CENTRAL_PASSWORD="${CENTRAL_PASSWORD:-password}"
CENTRAL_CONTAINER="${CENTRAL_CONTAINER:-arachne-central}"
CENTRAL_DATANODE_NAME="${CENTRAL_DATANODE_NAME:-Local Docker DataNode}"
DATANODE_URL="${DATANODE_URL:-http://localhost:8080}"
DATANODE_USERNAME="${DATANODE_USERNAME:-admin}"
DATANODE_PASSWORD="${DATANODE_PASSWORD:-ohdsi}"
DATANODE_DB_CONTAINER="${DATANODE_DB_CONTAINER:-arachne-datanode-postgres}"
DATANODE_DATASOURCE_ID="${DATANODE_DATASOURCE_ID:-}"
DATANODE_LOOKUP_MODE="${DATANODE_LOOKUP_MODE:-api}"
POLL_INTERVAL_SECONDS="${POLL_INTERVAL_SECONDS:-10}"
RUN_ONCE="${RUN_ONCE:-false}"
WORK_DIR="${WORK_DIR:-/tmp/arachne-federated-worker}"

mkdir -p "${WORK_DIR}"

central_psql() {
  docker exec -u postgres "${CENTRAL_CONTAINER}" psql -p 5434 -d arachne_portal -At -F $'\t' -c "$1"
}

datanode_psql() {
  docker exec "${DATANODE_DB_CONTAINER}" psql -U ohdsi-user -d arachne_datanode -At -F $'\t' -c "$1"
}

central_token() {
  local response
  response="$(
    curl -kfsS \
      -H 'Content-Type: application/json' \
      -d "{\"username\":\"${CENTRAL_USERNAME}\",\"password\":\"${CENTRAL_PASSWORD}\"}" \
      "${CENTRAL_URL}/api/v1/auth/login"
  )"
  jq -r '.result.token' <<< "${response}"
}

datanode_login() {
  local cookie_jar="$1"
  curl -fsS \
    -c "${cookie_jar}" \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"${DATANODE_USERNAME}\",\"password\":\"${DATANODE_PASSWORD}\"}" \
    "${DATANODE_URL}/api/v1/auth/login" >/dev/null
}

set_central_status() {
  local submission_id="$1"
  local status="$2"
  local comment="$3"

  central_psql "
    insert into submission_status_history (submission_id, date, status, comment)
    values (${submission_id}, now(), '${status}', '${comment}');
  " >/dev/null
}

pending_submissions() {
  central_psql "
    select
      s.id,
      coalesce(s.update_password, ''),
      s.submission_group_id,
      s.data_source_id,
      sg.analysis_type,
      ssh.status,
      coalesce(nullif(a.title, ''), 'Central submission ' || s.id),
      coalesce(
        nullif((
          select sf.entry_point
          from submission_files sf
          where sf.submission_group_id = s.submission_group_id
            and sf.entry_point is not null
            and sf.entry_point <> ''
          order by sf.id
          limit 1
        ), ''),
        (
          select sf.real_name
          from submission_files sf
          where sf.submission_group_id = s.submission_group_id
            and sf.executable is true
          order by sf.id
          limit 1
        ),
        (
          select sf.real_name
          from submission_files sf
          where sf.submission_group_id = s.submission_group_id
            and lower(sf.real_name) similar to '%.(sql|r|py)'
          order by sf.id
          limit 1
        ),
        (
          select sf.real_name
          from submission_files sf
          where sf.submission_group_id = s.submission_group_id
          order by sf.id
          limit 1
        )
      ) as executable_file
    from submissions s
    join submission_groups sg on sg.id = s.submission_group_id
    join analyses a on a.id = s.analysis_id
    join data_sources_data dsd on dsd.id = s.data_source_id
    join datanodes dn on dn.id = dsd.data_node_id
    join submission_status_history ssh on ssh.submission_id = s.id and ssh.is_last is true
    where dn.name = '${CENTRAL_DATANODE_NAME}'
      and ssh.status in ('PENDING', 'STARTING', 'QUEUE_PROCESSING', 'IN_PROGRESS')
    order by s.id;
  "
}

local_datasource_id() {
  local central_datasource_id="$1"
  datanode_psql "
    select id
    from datasource
    where central_id = ${central_datasource_id}
      and deleted_at is null
    order by id
    limit 1;
  "
}

datanode_analysis() {
  local central_submission_id="$1"
  if [ "${DATANODE_LOOKUP_MODE}" = "db" ]; then
    datanode_psql "
      select a.id, coalesce(a.state, ''), coalesce(s.stage, ''), coalesce(s.error, '')
      from analyses a
      left join analysis_state_journal s on s.id = a.current_state_id
      where a.central_id = ${central_submission_id}
      order by a.id desc
      limit 1;
    "
  else
    local cookie_jar response
    cookie_jar="${WORK_DIR}/datanode-list-cookies.txt"
    datanode_login "${cookie_jar}"
    response="$(
      curl -fsS \
        -b "${cookie_jar}" \
        "${DATANODE_URL}/api/v1/admin/submissions?sort=id,desc"
    )"
    jq -r \
      --argjson centralId "${central_submission_id}" \
      '.content[]? | select(.centralId == $centralId) | [.id, (.state // ""), (.state // ""), (.error // "")] | @tsv' \
      <<< "${response}" | head -n 1
  fi
}

upload_result_to_central() {
  local token="$1"
  local submission_id="$2"
  local result_zip="$3"

  curl -kfsS \
    -H "Arachne-Auth-Token: ${token}" \
    -F "file=@${result_zip};type=application/zip" \
    "${CENTRAL_URL}/api/v1/analysis-management/submissions/result/manualupload?submissionId=${submission_id}&archive=true&name=results.zip&label=results.zip" >/dev/null
}

prepare_datanode_bundle() {
  local source_bundle="$1"
  local executable_file="$2"
  local output_bundle="$3"

  python3 - "$source_bundle" "$executable_file" "$output_bundle" <<'PY'
import io
import json
import shutil
import sys
import zipfile
from pathlib import PurePosixPath

source_bundle, executable_file, output_bundle = sys.argv[1:4]

def basename(path):
    return PurePosixPath(path).name

def read_entry_point(package):
    for metadata_name in ("metadata.json", "analysisMetadata.json"):
        try:
            metadata = json.loads(package.read(metadata_name).decode("utf-8"))
        except KeyError:
            continue
        entry_point = metadata.get("entryPoint") or metadata.get("entry_point")
        if entry_point:
            return entry_point
    for name in package.namelist():
        if basename(name).lower() in ("run.r", "run.sql"):
            return basename(name)
    for name in package.namelist():
        if name.lower().endswith((".r", ".sql", ".py")):
            return basename(name)
    return executable_file

with zipfile.ZipFile(source_bundle, "r") as source:
    members = [name for name in source.namelist() if not name.endswith("/")]
    selected = None
    for name in members:
        if name == executable_file or basename(name) == executable_file:
            selected = name
            break

    if selected and selected.lower().endswith(".zip"):
        inner_bytes = io.BytesIO(source.read(selected))
        with zipfile.ZipFile(inner_bytes, "r") as package:
            entry_point = read_entry_point(package)
            with zipfile.ZipFile(output_bundle, "w", zipfile.ZIP_DEFLATED) as target:
                for item in package.infolist():
                    if item.is_dir():
                        continue
                    target.writestr(item.filename, package.read(item.filename))
        print(entry_point)
    else:
        shutil.copyfile(source_bundle, output_bundle)
        print(executable_file)
PY
}

stage_submission() {
  local token="$1"
  local submission_id="$2"
  local submission_group_id="$3"
  local central_datasource_id="$4"
  local analysis_type="$5"
  local title="$6"
  local executable_file="$7"

  local ds_id bundle datanode_bundle cookie_jar response datanode_analysis_id analysis_json datanode_executable_file
  if [ -n "${DATANODE_DATASOURCE_ID}" ]; then
    ds_id="${DATANODE_DATASOURCE_ID}"
  else
    ds_id="$(local_datasource_id "${central_datasource_id}")"
  fi
  if [ -z "${ds_id}" ]; then
    set_central_status "${submission_id}" "FAILED" "No local DataNode datasource has central_id ${central_datasource_id}"
    echo "Submission ${submission_id}: no local datasource for Central datasource ${central_datasource_id}"
    return
  fi

  if [ -z "${executable_file}" ]; then
    set_central_status "${submission_id}" "FAILED" "No executable file found in Central submission group ${submission_group_id}"
    echo "Submission ${submission_id}: no executable file found"
    return
  fi

  echo "Submission ${submission_id}: staging ${executable_file} on local datasource ${ds_id}"

  bundle="${WORK_DIR}/central-submission-${submission_id}.zip"
  datanode_bundle="${WORK_DIR}/datanode-submission-${submission_id}.zip"
  cookie_jar="${WORK_DIR}/datanode-cookies-${submission_id}.txt"

  curl -kfsS \
    -H "Arachne-Auth-Token: ${token}" \
    -o "${bundle}" \
    "${CENTRAL_URL}/api/v1/analysis-management/submission-groups/${submission_group_id}/files/all"

  datanode_executable_file="$(prepare_datanode_bundle "${bundle}" "${executable_file}" "${datanode_bundle}")"
  if [ -z "${datanode_executable_file}" ]; then
    set_central_status "${submission_id}" "FAILED" "Could not resolve executable file from Central submission group ${submission_group_id}"
    echo "Submission ${submission_id}: could not resolve executable file"
    return
  fi

  datanode_login "${cookie_jar}"
  analysis_json="$(
    jq -nc \
      --arg executableFileName "${datanode_executable_file}" \
      --arg title "${title}" \
      --arg study "Central" \
      --arg type "${analysis_type}" \
      --argjson datasourceId "${ds_id}" \
      '{executableFileName: $executableFileName, datasourceId: $datasourceId, title: $title, study: $study, type: $type}'
  )"
  response="$(
    curl -fsS \
      -b "${cookie_jar}" \
      -F "file=@${datanode_bundle};type=application/zip" \
      -F "analysis=${analysis_json};type=application/json" \
      "${DATANODE_URL}/api/v1/analysis/central/zip?centralSubmissionId=${submission_id}"
  )"
  datanode_analysis_id="$(tr -dc '0-9' <<< "${response}")"

  if [ -z "${datanode_analysis_id}" ]; then
    set_central_status "${submission_id}" "FAILED" "DataNode did not return a local analysis id"
    echo "Submission ${submission_id}: DataNode response was [${response}]"
    return
  fi

  echo "Submission ${submission_id}: staged as local DataNode analysis ${datanode_analysis_id}; waiting for DataNode approval"
}

process_submission() {
  local token="$1"
  local submission_id="$2"
  local update_password="$3"
  local submission_group_id="$4"
  local central_datasource_id="$5"
  local analysis_type="$6"
  local central_status="$7"
  local title="$8"
  local executable_file="$9"

  local datanode_analysis_id datanode_state stage error result_zip cookie_jar
  local local_analysis_row
  local_analysis_row="$(datanode_analysis "${submission_id}")"
  if [ -n "${local_analysis_row}" ]; then
    IFS=$'\t' read -r datanode_analysis_id datanode_state stage error <<< "${local_analysis_row}"
  else
    datanode_analysis_id=""
    datanode_state=""
    stage=""
    error=""
  fi

  if [ -z "${datanode_analysis_id}" ]; then
    stage_submission "${token}" "${submission_id}" "${submission_group_id}" "${central_datasource_id}" "${analysis_type}" "${title}" "${executable_file}"
    return
  fi

  case "${datanode_state}" in
    PENDING_APPROVAL)
      echo "Submission ${submission_id}: waiting for DataNode approval as local analysis ${datanode_analysis_id}"
      ;;
    FAILED|ABORTED|ABORT_FAILED)
      if [ "${central_status}" != "FAILED" ]; then
        set_central_status "${submission_id}" "FAILED" "Rejected or failed at DataNode analysis ${datanode_analysis_id}: ${error}"
      fi
      echo "Submission ${submission_id}: rejected or failed at DataNode"
      ;;
    COMPLETED)
      result_zip="${WORK_DIR}/datanode-results-${submission_id}.zip"
      cookie_jar="${WORK_DIR}/datanode-cookies-${submission_id}.txt"
      datanode_login "${cookie_jar}"
      curl -fsS -b "${cookie_jar}" -o "${result_zip}" "${DATANODE_URL}/api/v1/analysis/${datanode_analysis_id}/results"
      if upload_result_to_central "${token}" "${submission_id}" "${result_zip}"; then
        set_central_status "${submission_id}" "EXECUTED" "Completed by local DataNode analysis ${datanode_analysis_id}"
        echo "Submission ${submission_id}: results uploaded to Central"
      else
        set_central_status "${submission_id}" "FAILED" "DataNode completed analysis ${datanode_analysis_id}, but Central result upload failed"
        echo "Submission ${submission_id}: result upload failed"
      fi
      ;;
    *)
      if [ "${central_status}" != "IN_PROGRESS" ]; then
        set_central_status "${submission_id}" "IN_PROGRESS" "Approved and running at local DataNode analysis ${datanode_analysis_id}"
      fi
      echo "Submission ${submission_id}: running at local DataNode analysis ${datanode_analysis_id}"
      ;;
  esac
}

main_loop() {
  local token rows submission
  while true; do
    token="$(central_token)"
    rows="$(pending_submissions)"

    if [ -n "${rows}" ]; then
      while IFS=$'\t' read -r submission_id update_password submission_group_id central_datasource_id analysis_type central_status title executable_file; do
        [ -z "${submission_id}" ] && continue
        process_submission "${token}" "${submission_id}" "${update_password}" "${submission_group_id}" "${central_datasource_id}" "${analysis_type}" "${central_status}" "${title}" "${executable_file}"
      done <<< "${rows}"
    fi

    if [ "${RUN_ONCE}" = "true" ]; then
      break
    fi
    sleep "${POLL_INTERVAL_SECONDS}"
  done
}

if [ "${FEDERATED_WORKER_LIBRARY_MODE:-false}" != "true" ]; then
  main_loop
fi
