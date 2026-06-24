#!/usr/bin/env sh
set -eu

mkdir -p logs pids

started=0
for env_file in workers/*.env; do
  [ -f "${env_file}" ] || continue
  name="$(basename "${env_file}" .env)"
  pid_file="pids/${name}.pid"
  log_file="logs/${name}.log"

  if [ -f "${pid_file}" ] && kill -0 "$(cat "${pid_file}")" 2>/dev/null; then
    echo "${name}: already running as PID $(cat "${pid_file}")"
    continue
  fi

  echo "${name}: starting"
  nohup ./run-worker.sh "${env_file}" > "${log_file}" 2>&1 &
  echo "$!" > "${pid_file}"
  started=$((started + 1))
done

if [ "${started}" -eq 0 ]; then
  echo "No workers started. Create workers/site1.env, workers/site2.env, etc. from the examples first."
fi
