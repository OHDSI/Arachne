#!/bin/sh
set -eu

ZIP_FILE="${1:-}"
CDM_SCHEMA="${CDM_SCHEMA:-omop}"

if [ -z "${ZIP_FILE}" ]; then
  echo "Usage: import-csv-zip.sh /path/to/archive.zip" >&2
  exit 1
fi

if [ ! -f "${ZIP_FILE}" ]; then
  echo "Archive not found: ${ZIP_FILE}" >&2
  exit 1
fi

WORKDIR="$(mktemp -d)"
trap 'rm -rf "${WORKDIR}"' EXIT

unzip -oq "${ZIP_FILE}" -d "${WORKDIR}"

CSV_FILES="$(find "${WORKDIR}" -type f -iname '*.csv' | sort)"

TABLES=""
for csv in ${CSV_FILES}; do
  table="$(basename "${csv}" .csv | tr '[:upper:]' '[:lower:]')"
  if psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" -tAc \
    "SELECT 1 FROM information_schema.tables WHERE table_schema = '${CDM_SCHEMA}' AND table_name = '${table}'" | grep -qx '1'; then
    TABLES="${TABLES} ${table}"
  else
    echo "Skipping ${table}: table ${CDM_SCHEMA}.\"${table}\" does not exist"
  fi
done

if [ -z "${TABLES}" ]; then
  echo "No importable CSV files found in ${ZIP_FILE}" >&2
  exit 1
fi

drop_vocab_constraints() {
  psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<EOSQL
ALTER TABLE ${CDM_SCHEMA}.concept DROP CONSTRAINT IF EXISTS fpk_concept_domain_id;
ALTER TABLE ${CDM_SCHEMA}.concept DROP CONSTRAINT IF EXISTS fpk_concept_vocabulary_id;
ALTER TABLE ${CDM_SCHEMA}.concept DROP CONSTRAINT IF EXISTS fpk_concept_concept_class_id;
ALTER TABLE ${CDM_SCHEMA}.vocabulary DROP CONSTRAINT IF EXISTS fpk_vocabulary_vocabulary_concept_id;
ALTER TABLE ${CDM_SCHEMA}.domain DROP CONSTRAINT IF EXISTS fpk_domain_domain_concept_id;
ALTER TABLE ${CDM_SCHEMA}.concept_class DROP CONSTRAINT IF EXISTS fpk_concept_class_concept_class_concept_id;
ALTER TABLE ${CDM_SCHEMA}.relationship DROP CONSTRAINT IF EXISTS fpk_relationship_relationship_concept_id;
ALTER TABLE ${CDM_SCHEMA}.concept_relationship DROP CONSTRAINT IF EXISTS fpk_concept_relationship_concept_id_1;
ALTER TABLE ${CDM_SCHEMA}.concept_relationship DROP CONSTRAINT IF EXISTS fpk_concept_relationship_concept_id_2;
ALTER TABLE ${CDM_SCHEMA}.concept_relationship DROP CONSTRAINT IF EXISTS fpk_concept_relationship_relationship_id;
ALTER TABLE ${CDM_SCHEMA}.concept_synonym DROP CONSTRAINT IF EXISTS fpk_concept_synonym_concept_id;
ALTER TABLE ${CDM_SCHEMA}.concept_synonym DROP CONSTRAINT IF EXISTS fpk_concept_synonym_language_concept_id;
ALTER TABLE ${CDM_SCHEMA}.concept_ancestor DROP CONSTRAINT IF EXISTS fpk_concept_ancestor_ancestor_concept_id;
ALTER TABLE ${CDM_SCHEMA}.concept_ancestor DROP CONSTRAINT IF EXISTS fpk_concept_ancestor_descendant_concept_id;
ALTER TABLE ${CDM_SCHEMA}.source_to_concept_map DROP CONSTRAINT IF EXISTS fpk_source_to_concept_map_source_concept_id;
ALTER TABLE ${CDM_SCHEMA}.source_to_concept_map DROP CONSTRAINT IF EXISTS fpk_source_to_concept_map_target_concept_id;
ALTER TABLE ${CDM_SCHEMA}.source_to_concept_map DROP CONSTRAINT IF EXISTS fpk_source_to_concept_map_target_vocabulary_id;
ALTER TABLE ${CDM_SCHEMA}.drug_strength DROP CONSTRAINT IF EXISTS fpk_drug_strength_drug_concept_id;
ALTER TABLE ${CDM_SCHEMA}.drug_strength DROP CONSTRAINT IF EXISTS fpk_drug_strength_ingredient_concept_id;
ALTER TABLE ${CDM_SCHEMA}.drug_strength DROP CONSTRAINT IF EXISTS fpk_drug_strength_amount_unit_concept_id;
ALTER TABLE ${CDM_SCHEMA}.drug_strength DROP CONSTRAINT IF EXISTS fpk_drug_strength_numerator_unit_concept_id;
ALTER TABLE ${CDM_SCHEMA}.drug_strength DROP CONSTRAINT IF EXISTS fpk_drug_strength_denominator_unit_concept_id;
EOSQL
}

add_vocab_constraints() {
  psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<EOSQL
ALTER TABLE ${CDM_SCHEMA}.concept ADD CONSTRAINT fpk_concept_domain_id FOREIGN KEY (domain_id) REFERENCES ${CDM_SCHEMA}.domain (domain_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept ADD CONSTRAINT fpk_concept_vocabulary_id FOREIGN KEY (vocabulary_id) REFERENCES ${CDM_SCHEMA}.vocabulary (vocabulary_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept ADD CONSTRAINT fpk_concept_concept_class_id FOREIGN KEY (concept_class_id) REFERENCES ${CDM_SCHEMA}.concept_class (concept_class_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.vocabulary ADD CONSTRAINT fpk_vocabulary_vocabulary_concept_id FOREIGN KEY (vocabulary_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.domain ADD CONSTRAINT fpk_domain_domain_concept_id FOREIGN KEY (domain_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept_class ADD CONSTRAINT fpk_concept_class_concept_class_concept_id FOREIGN KEY (concept_class_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.relationship ADD CONSTRAINT fpk_relationship_relationship_concept_id FOREIGN KEY (relationship_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept_relationship ADD CONSTRAINT fpk_concept_relationship_concept_id_1 FOREIGN KEY (concept_id_1) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept_relationship ADD CONSTRAINT fpk_concept_relationship_concept_id_2 FOREIGN KEY (concept_id_2) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept_relationship ADD CONSTRAINT fpk_concept_relationship_relationship_id FOREIGN KEY (relationship_id) REFERENCES ${CDM_SCHEMA}.relationship (relationship_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept_synonym ADD CONSTRAINT fpk_concept_synonym_concept_id FOREIGN KEY (concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept_synonym ADD CONSTRAINT fpk_concept_synonym_language_concept_id FOREIGN KEY (language_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept_ancestor ADD CONSTRAINT fpk_concept_ancestor_ancestor_concept_id FOREIGN KEY (ancestor_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.concept_ancestor ADD CONSTRAINT fpk_concept_ancestor_descendant_concept_id FOREIGN KEY (descendant_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.source_to_concept_map ADD CONSTRAINT fpk_source_to_concept_map_source_concept_id FOREIGN KEY (source_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.source_to_concept_map ADD CONSTRAINT fpk_source_to_concept_map_target_concept_id FOREIGN KEY (target_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.source_to_concept_map ADD CONSTRAINT fpk_source_to_concept_map_target_vocabulary_id FOREIGN KEY (target_vocabulary_id) REFERENCES ${CDM_SCHEMA}.vocabulary (vocabulary_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.drug_strength ADD CONSTRAINT fpk_drug_strength_drug_concept_id FOREIGN KEY (drug_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.drug_strength ADD CONSTRAINT fpk_drug_strength_ingredient_concept_id FOREIGN KEY (ingredient_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.drug_strength ADD CONSTRAINT fpk_drug_strength_amount_unit_concept_id FOREIGN KEY (amount_unit_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.drug_strength ADD CONSTRAINT fpk_drug_strength_numerator_unit_concept_id FOREIGN KEY (numerator_unit_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
ALTER TABLE ${CDM_SCHEMA}.drug_strength ADD CONSTRAINT fpk_drug_strength_denominator_unit_concept_id FOREIGN KEY (denominator_unit_concept_id) REFERENCES ${CDM_SCHEMA}.concept (concept_id) NOT VALID;
EOSQL
}

drop_vocab_constraints

TRUNCATE_SQL="TRUNCATE TABLE"
for table in ${TABLES}; do
  TRUNCATE_SQL="${TRUNCATE_SQL} ${CDM_SCHEMA}.\"${table}\","
done
TRUNCATE_SQL="${TRUNCATE_SQL%,} CASCADE;"

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" \
  -c "${TRUNCATE_SQL}"

load_table() {
  table="$1"
  csv="$(find "${WORKDIR}" -type f -iname "${table}.csv" | head -n 1 || true)"
  if [ -z "${csv}" ]; then
    return 0
  fi
  case " ${TABLES} " in
    *" ${table} "*) ;;
    *)
      return 0
      ;;
  esac
  echo "Loading ${table} from ${csv}"
  psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" \
    -c "\\copy ${CDM_SCHEMA}.\"${table}\" FROM '${csv}' WITH (FORMAT text, HEADER true, DELIMITER E'\\t', NULL '')"
}

for table in \
  vocabulary \
  domain \
  concept_class \
  relationship \
  concept \
  concept_synonym \
  concept_relationship \
  concept_ancestor \
  source_to_concept_map \
  drug_strength
do
  load_table "${table}"
done

add_vocab_constraints
