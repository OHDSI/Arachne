suppressMessages(library(DatabaseConnector))
suppressMessages(library(SqlRender))
suppressMessages(library(data.table))

output_dir <- file.path(getwd(), "my_results")
dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

log_file <- file.path(output_dir, "diagnostics.log")
log_line <- function(...) {
  line <- paste(...)
  cat(line, "\n")
  write(line, file = log_file, append = TRUE)
}

cohort_id <- as.integer("{{COHORT_ID}}")
analysis_name <- "{{ANALYSIS_NAME}}"
target_cohort_table <- "{{TARGET_COHORT_TABLE}}"

dbms <- Sys.getenv("DBMS_TYPE")
connection_string <- Sys.getenv("CONNECTION_STRING")
user <- Sys.getenv("DBMS_USERNAME")
pwd <- Sys.getenv("DBMS_PASSWORD")
cdm_database_schema <- Sys.getenv("DBMS_SCHEMA")
target_database_schema <- Sys.getenv("RESULTS_SCHEMA")
drivers_path <- Sys.getenv("JDBC_DRIVER_PATH")

if (!nzchar(dbms)) dbms <- "postgresql"
dbms <- tolower(dbms)
if (!nzchar(cdm_database_schema)) cdm_database_schema <- "omop"
if (!nzchar(target_database_schema)) target_database_schema <- "results"
if (!nzchar(drivers_path)) drivers_path <- NULL

extract_jdbc_parts <- function(value) {
  pattern <- "^jdbc:postgresql://([^/:?]+)(?::([0-9]+))?/([^?]+)(\\?.*)?$"
  match <- regexec(pattern, value, perl = TRUE)
  parts <- regmatches(value, match)[[1]]
  if (length(parts) == 0) return(NULL)
  list(
    host = parts[2],
    port = if (nzchar(parts[3])) as.integer(parts[3]) else 5432L,
    dbname = parts[4]
  )
}

open_connection <- function() {
  parts <- extract_jdbc_parts(connection_string)
  if (is.null(parts)) {
    stop("Unable to parse PostgreSQL JDBC connection string")
  }

  connection_args <- list(
    dbms = dbms,
    server = sprintf("%s/%s", parts$host, parts$dbname),
    port = parts$port,
    user = user,
    password = pwd
  )
  if (!is.null(drivers_path)) {
    connection_args$pathToDriver <- drivers_path
  }
  connection_details <- do.call(DatabaseConnector::createConnectionDetails, connection_args)
  DatabaseConnector::connect(connectionDetails = connection_details)
}

log_line("Starting ATLAS cohort analysis:", analysis_name)
log_line("Cohort ID:", cohort_id)
log_line("CDM schema:", cdm_database_schema)
log_line("Results schema:", target_database_schema)
log_line("Target cohort table:", target_cohort_table)

conn <- open_connection()
on.exit(DatabaseConnector::disconnect(conn), add = TRUE)

cohort_sql <- SqlRender::readSql(file.path(getwd(), "sql", "cohort.sql"))
cohort_sql <- SqlRender::render(
  cohort_sql,
  cdm_database_schema = cdm_database_schema,
  vocabulary_database_schema = cdm_database_schema,
  target_database_schema = target_database_schema,
  target_cohort_table = target_cohort_table,
  target_cohort_id = cohort_id
)
cohort_sql <- SqlRender::translate(cohort_sql, targetDialect = dbms)

log_line("Executing cohort SQL")
DatabaseConnector::executeSql(conn, cohort_sql)

qualified_cohort_table <- sprintf("%s.%s", target_database_schema, target_cohort_table)

cohort_count_sql <- sprintf(
  "SELECT %s AS cohort_definition_id, COUNT(DISTINCT subject_id) AS person_count, COUNT(*) AS row_count FROM %s WHERE cohort_definition_id = %s",
  cohort_id,
  qualified_cohort_table,
  cohort_id
)
cohort_count <- DatabaseConnector::querySql(conn, cohort_count_sql)
data.table::fwrite(cohort_count, file.path(output_dir, "cohort_count.csv"))

monthly_sql <- sprintf(
  paste(
    "SELECT DATE_TRUNC('month', cohort_start_date)::date AS month_start,",
    "COUNT(DISTINCT subject_id) AS person_count,",
    "COUNT(*) AS row_count",
    "FROM %s",
    "WHERE cohort_definition_id = %s",
    "GROUP BY 1",
    "ORDER BY 1"
  ),
  qualified_cohort_table,
  cohort_id
)
monthly_counts <- DatabaseConnector::querySql(conn, monthly_sql)
data.table::fwrite(monthly_counts, file.path(output_dir, "cohort_monthly_counts.csv"))

sex_sql <- sprintf(
  paste(
    "SELECT COALESCE(c.concept_name, 'Unknown') AS sex,",
    "COUNT(DISTINCT cohort.subject_id) AS person_count",
    "FROM %s cohort",
    "JOIN %s.person p ON p.person_id = cohort.subject_id",
    "LEFT JOIN %s.concept c ON c.concept_id = p.gender_concept_id",
    "WHERE cohort.cohort_definition_id = %s",
    "GROUP BY COALESCE(c.concept_name, 'Unknown')",
    "ORDER BY person_count DESC, sex"
  ),
  qualified_cohort_table,
  cdm_database_schema,
  cdm_database_schema,
  cohort_id
)
sex_counts <- DatabaseConnector::querySql(conn, sex_sql)
data.table::fwrite(sex_counts, file.path(output_dir, "cohort_sex_counts.csv"))

summary <- data.table::data.table(
  analysis_name = analysis_name,
  cohort_id = cohort_id,
  cdm_database_schema = cdm_database_schema,
  target_database_schema = target_database_schema,
  target_cohort_table = target_cohort_table,
  generated_at = as.character(Sys.time())
)
data.table::fwrite(summary, file.path(output_dir, "analysis_summary.csv"))

log_line("Wrote aggregate outputs to", output_dir)
