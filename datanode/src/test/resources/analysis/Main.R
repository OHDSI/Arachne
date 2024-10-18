suppressMessages(library(DatabaseConnector))
tryCatch({
  install.packages(file.path(getwd())
                   , repos = NULL, type = "source", INSTALL_opts=c("--no-multiarch"))
}, finally = {})

tryCatch( {
  outputFolder <- file.path(getwd(), 'my_results')
  dir.create(outputFolder, showWarnings = F)
  dbms <- Sys.getenv("DBMS_TYPE")
  connectionString <- Sys.getenv("CONNECTION_STRING")
  user <- Sys.getenv("DBMS_USERNAME")
  pwd <- Sys.getenv("DBMS_PASSWORD")
  cdmDatabaseSchema <- Sys.getenv("DBMS_SCHEMA")
  resultsDatabaseSchema <- Sys.getenv("RESULT_SCHEMA")
  cohortsDatabaseSchema <- Sys.getenv("TARGET_SCHEMA")
  cohortTable <- Sys.getenv("COHORT_TARGET_TABLE")
  driversPath <- (function(path) if (path == "") NULL else path)( Sys.getenv("JDBC_DRIVER_PATH") )
  connectionDetails <- DatabaseConnector::createConnectionDetails(
    dbms = dbms,
    connectionString = connectionString,
    user = user,
    password = pwd,
    pathToDriver = driversPath
  )
  conn <- connect(connectionDetails = connectionDetails)
  GenerateSurvival::createCohorts(
    connection = conn,
    cdmDatabaseSchema = cdmDatabaseSchema,
    cohortDatabaseSchema = cohortsDatabaseSchema,
    cohortTable = cohortTable
  )
  settings <- GenerateSurvival::settingsGs()
  res <- purrr::map_dfr(settings$outcomeIds, ~GenerateSurvival::generateSurvivalInfo(
    connection = conn,
    cohortDatabaseSchema = cohortsDatabaseSchema,
    cohortTable = cohortTable,
    targetIds = settings$targetIds,
    cdmSchema = cdmDatabaseSchema,
    outcomeId = .x
  ))
  data.table::fwrite(res, 'my_results/surv_info.csv')

} , finally = {}
)
