#' @export
createCohorts <- function(
    connection,
    cdmDatabaseSchema,
    cohortDatabaseSchema,
    cohortTable,
    tempEmulationSchema = NULL
) {
  pathToCsv <- system.file(
    "settings",
    "CohortsToCreate.csv",
    package = getThisPackageName()
  )
  cohortsToCreate <- readr::read_csv(pathToCsv, col_types = readr::cols())
  for (i in 1:nrow(cohortsToCreate)) {
    writeLines(paste("Creating cohort:", cohortsToCreate$cohort_name[i]))
    SqlRender::loadRenderTranslateSql(
      sqlFilename = paste0(cohortsToCreate$cohort_name[i], ".sql"),
      packageName = getThisPackageName(),
      dbms = attr(connection, "dbms"),
      tempEmulationSchema = tempEmulationSchema,
      cdm_database_schema = cdmDatabaseSchema,
      vocabulary_database_schema = cdmDatabaseSchema,
      target_database_schema = cohortDatabaseSchema,
      target_cohort_table = cohortTable,
      target_cohort_id = cohortsToCreate$cohort_id[i],
      warnOnMissingParameters = FALSE
    ) %>% DatabaseConnector::executeSql(connection = connection,  sql = .)
  }
}
