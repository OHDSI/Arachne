tryCatch({
  tarIds <- c(617:622)
  outcomeIds <- 162
  baseUrl <-  Sys.getenv("BaseUrl")
  webApiUsername <- Sys.getenv("WEBAPI_USERNAME")
  webApiPassword <- Sys.getenv("WEBAPI_PASSWORD")
  authMethod <- "db"
  GenerateSurvival::setPackageUtilits(
    baseUrl,
    authMethod,
    webApiUsername,
    webApiPassword,
    atlasTargetCohortIds = tarIds,
    atlasOutcomeCohortIds = outcomeIds,
    cleanPreviousFiles = TRUE
  )
  zip(zipfile = 'survZip', files = dir('.', full.names = T))
}, finally = {})
