#!/bin/sh
set -eu

CDM_SCHEMA="${CDM_SCHEMA:-omop}"

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<EOSQL
DO \$\$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = '${CDM_SCHEMA}'
          AND table_name = 'concept'
    ) THEN
        RAISE EXCEPTION 'CDM schema %.concept not found', '${CDM_SCHEMA}';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM ${CDM_SCHEMA}.concept
        WHERE concept_id = 0
    ) THEN
        RAISE EXCEPTION 'Concept 0 is missing. Load Athena vocabularies first.';
    END IF;
END
\$\$;

INSERT INTO ${CDM_SCHEMA}.person (
    person_id,
    gender_concept_id,
    year_of_birth,
    month_of_birth,
    day_of_birth,
    birth_datetime,
    race_concept_id,
    ethnicity_concept_id,
    person_source_value,
    gender_source_value,
    gender_source_concept_id,
    race_source_value,
    race_source_concept_id,
    ethnicity_source_value,
    ethnicity_source_concept_id
) VALUES
    (1001, 0, 1980, 1, 15, TIMESTAMP '1980-01-15 00:00:00', 0, 0, 'demo-1001', 'U', 0, 'UNK', 0, 'UNK', 0),
    (1002, 0, 1972, 7, 3, TIMESTAMP '1972-07-03 00:00:00', 0, 0, 'demo-1002', 'U', 0, 'UNK', 0, 'UNK', 0),
    (1003, 0, 1991, 11, 22, TIMESTAMP '1991-11-22 00:00:00', 0, 0, 'demo-1003', 'U', 0, 'UNK', 0, 'UNK', 0)
ON CONFLICT (person_id) DO NOTHING;

INSERT INTO ${CDM_SCHEMA}.observation_period (
    observation_period_id,
    person_id,
    observation_period_start_date,
    observation_period_end_date,
    period_type_concept_id
) VALUES
    (2001, 1001, DATE '2020-01-01', DATE '2020-12-31', 0),
    (2002, 1002, DATE '2020-01-01', DATE '2020-12-31', 0),
    (2003, 1003, DATE '2020-01-01', DATE '2020-12-31', 0)
ON CONFLICT (observation_period_id) DO NOTHING;

INSERT INTO ${CDM_SCHEMA}.condition_occurrence (
    condition_occurrence_id,
    person_id,
    condition_concept_id,
    condition_start_date,
    condition_start_datetime,
    condition_end_date,
    condition_end_datetime,
    condition_type_concept_id,
    condition_status_concept_id,
    condition_source_value,
    condition_source_concept_id,
    condition_status_source_value
) VALUES
    (3001, 1001, 0, DATE '2020-03-10', TIMESTAMP '2020-03-10 09:00:00', DATE '2020-03-10', TIMESTAMP '2020-03-10 09:00:00', 0, 0, 'demo-condition-a', 0, 'UNK'),
    (3002, 1002, 0, DATE '2020-05-04', TIMESTAMP '2020-05-04 13:30:00', DATE '2020-05-04', TIMESTAMP '2020-05-04 13:30:00', 0, 0, 'demo-condition-b', 0, 'UNK'),
    (3003, 1003, 0, DATE '2020-08-19', TIMESTAMP '2020-08-19 16:45:00', DATE '2020-08-19', TIMESTAMP '2020-08-19 16:45:00', 0, 0, 'demo-condition-c', 0, 'UNK')
ON CONFLICT (condition_occurrence_id) DO NOTHING;
EOSQL

echo "Inserted synthetic sample patients into ${CDM_SCHEMA}"
