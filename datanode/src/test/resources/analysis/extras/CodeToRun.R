
suppressMessages(library(DatabaseConnector))
setwd("./")
tryCatch({
  install.packages(getwd()#file.path(".")
                   , repos = NULL, type = "source", INSTALL_opts=c("--no-multiarch"))
}, finally = {})

tryCatch( {
  dbms <- Sys.getenv("DBMS_TYPE")
  connectionString <- Sys.getenv("CONNECTION_STRING")
  user <- Sys.getenv("DBMS_USERNAME")
  pwd <- Sys.getenv("DBMS_PASSWORD")
  cdmDatabaseSchema <- Sys.getenv("DBMS_SCHEMA")
  resultsDatabaseSchema <- 'alex_alexeyuk_results'
  cohortsDatabaseSchema <- 'alex_alexeyuk_results'
  cohortTable <- 'takeda_test'
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
    connectionDetails = connectionDetails,
    connection = conn,
    cdmDatabaseSchema = cdmDatabaseSchema,
    tempEmulationSchema = NULL,
    cohortDatabaseSchema = cohortDatabaseSchema,
    cohortTable = cohortTable,
    cohortIds = 101,
    createCohortTable = TRUE,
    outputFolder = getwd()
  )
  outputFolder <- file.path(getwd(), 'my_results')
  dir.create(outputFolder)

  res <- GenerateSurvival::generateSurvivalInfo(
    conn,
    cohortDatabaseSchema = cohortDatabaseSchema,
    cohortTable = cohortTable,
    targetIds = 100:104,
    outcomeId = 200,
    packageName = 'GenerateSurvival',
    databaseId = 'we'
  )
  data.table::fwrite(res, 'my_results/surv_info.csv')

} , finally = {}
)
