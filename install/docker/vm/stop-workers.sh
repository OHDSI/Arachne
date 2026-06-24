#!/usr/bin/env sh
set -eu

if [ ! -d pids ]; then
  echo "No pids directory found."
  exit 0
fi

for pid_file in pids/*.pid; do
  [ -f "${pid_file}" ] || continue
  name="$(basename "${pid_file}" .pid)"
  pid="$(cat "${pid_file}")"
  if kill -0 "${pid}" 2>/dev/null; then
    echo "${name}: stopping PID ${pid}"
    kill "${pid}"
  else
    echo "${name}: PID ${pid} is not running"
  fi
  rm -f "${pid_file}"
done
