#!/bin/sh
set -eu

RESULTS_SCHEMA="${RESULTS_SCHEMA:-results}"

echo "Initializing OMOP results schema ${RESULTS_SCHEMA}"

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<EOSQL
CREATE SCHEMA IF NOT EXISTS ${RESULTS_SCHEMA};

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort (
  cohort_definition_id integer NOT NULL,
  subject_id bigint NOT NULL,
  cohort_start_date date NOT NULL,
  cohort_end_date date NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_cache (
  design_hash integer NOT NULL,
  subject_id bigint NOT NULL,
  cohort_start_date date NOT NULL,
  cohort_end_date date NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_inclusion (
  cohort_definition_id integer NOT NULL,
  design_hash integer,
  rule_sequence integer NOT NULL,
  name varchar(255),
  description varchar(1000)
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_inclusion_result (
  cohort_definition_id integer NOT NULL,
  mode_id integer NOT NULL,
  inclusion_rule_mask bigint NOT NULL,
  person_count bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_inclusion_result_cache (
  design_hash integer NOT NULL,
  mode_id integer NOT NULL,
  inclusion_rule_mask bigint NOT NULL,
  person_count bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_inclusion_stats (
  cohort_definition_id integer NOT NULL,
  rule_sequence integer NOT NULL,
  mode_id integer NOT NULL,
  person_count bigint NOT NULL,
  gain_count bigint NOT NULL,
  person_total bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_inclusion_stats_cache (
  design_hash integer NOT NULL,
  rule_sequence integer NOT NULL,
  mode_id integer NOT NULL,
  person_count bigint NOT NULL,
  gain_count bigint NOT NULL,
  person_total bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_summary_stats (
  cohort_definition_id integer NOT NULL,
  mode_id integer NOT NULL,
  base_count bigint NOT NULL,
  final_count bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_summary_stats_cache (
  design_hash integer NOT NULL,
  mode_id integer NOT NULL,
  base_count bigint NOT NULL,
  final_count bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_censor_stats (
  cohort_definition_id integer NOT NULL,
  lost_count bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS ${RESULTS_SCHEMA}.cohort_censor_stats_cache (
  design_hash integer NOT NULL,
  lost_count bigint NOT NULL
);
EOSQL

echo "OMOP results schema initialization complete"
