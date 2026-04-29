#!/bin/sh
set -eu

CDM_VERSION="${CDM_VERSION:-5.4.2}"
CDM_SCHEMA="${CDM_SCHEMA:-omop}"
DDL_BASE_URL="https://raw.githubusercontent.com/OHDSI/CommonDataModel/v${CDM_VERSION}/inst/ddl/5.4/postgresql"
DDL_DIR="/tmp/omop-cdm-ddl"
EXTENSION_TEMPLATE="/docker-entrypoint-initdb.d/amr_extension.sql.template"
EXTENSION_SQL="${DDL_DIR}/amr_extension.sql"

mkdir -p "${DDL_DIR}"

download_and_prepare() {
  file="$1"
  curl -fsSL "${DDL_BASE_URL}/${file}" -o "${DDL_DIR}/${file}"
  sed \
    -e "s/@cdmDatabaseSchema/${CDM_SCHEMA}/g" \
    -e "s/@vocabularyDatabaseSchema/${CDM_SCHEMA}/g" \
    "${DDL_DIR}/${file}" > "${DDL_DIR}/run-${file}"
}

echo "Initializing OMOP CDM v${CDM_VERSION} in schema ${CDM_SCHEMA}"

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<EOSQL
CREATE SCHEMA IF NOT EXISTS ${CDM_SCHEMA};
EOSQL

for file in \
  OMOPCDM_postgresql_5.4_ddl.sql \
  OMOPCDM_postgresql_5.4_primary_keys.sql \
  OMOPCDM_postgresql_5.4_constraints.sql \
  OMOPCDM_postgresql_5.4_indices.sql
do
  echo "Applying ${file}"
  download_and_prepare "${file}"
  psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" \
    -f "${DDL_DIR}/run-${file}"
done

if [ -f "${EXTENSION_TEMPLATE}" ]; then
  echo "Applying AMR extension tables"
  sed "s/@cdmDatabaseSchema/${CDM_SCHEMA}/g" "${EXTENSION_TEMPLATE}" > "${EXTENSION_SQL}"
  psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" \
    -f "${EXTENSION_SQL}"
fi

echo "OMOP CDM initialization complete"
