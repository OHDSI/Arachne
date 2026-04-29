#!/bin/sh
set -eu

IMPORT_DIR="${IMPORT_DIR:-/opt/arachne-cdm/imports/athena}"

ZIP_FILE="$(find "${IMPORT_DIR}" -maxdepth 1 -type f -name '*.zip' | head -n 1 || true)"

if [ -z "${ZIP_FILE}" ]; then
  echo "No Athena vocabulary zip found in ${IMPORT_DIR}" >&2
  echo "Place your Athena download zip there and rerun this script." >&2
  exit 1
fi

echo "Importing Athena vocabulary from ${ZIP_FILE}"
/opt/arachne-cdm/tools/import-csv-zip.sh "${ZIP_FILE}"
