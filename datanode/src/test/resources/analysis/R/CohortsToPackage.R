#' @importFrom magrittr %>%
#'
#'
#' @export
setPackageUtilits <- function(
  baseUrl,
  authMethod,
  webApiUsername,
  webApiPassword,
  atlasTargetCohortIds,
  atlasOutcomeCohortIds,
  cleanPreviousFiles = TRUE
) {
  httr::set_config(httr::config(ssl_verifypeer = FALSE))
  if(cleanPreviousFiles) {
    unlink(here::here("inst/cohorts/*"))
    unlink(here::here("inst/sql/sql_server/*"))
  }
  ROhdsiWebApi::authorizeWebApi(baseUrl = baseUrl,
                  authMethod = authMethod,
                  webApiUsername = webApiUsername,
                  webApiPassword = webApiPassword)
  atlasCohortIds <- union(atlasTargetCohortIds, atlasOutcomeCohortIds)
  webApiCohorts <-
    ROhdsiWebApi::getCohortDefinitionsMetaData(baseUrl = baseUrl) %>%
    dplyr::filter(.data$id %in% atlasCohortIds)
  cohortsToCreate <- list()
  for (i in (1:nrow(webApiCohorts))) {
    cohortId <- webApiCohorts$id[[i]]
    cohortDefinition <-
      ROhdsiWebApi::getCohortDefinition(cohortId = cohortId,
                                        baseUrl = baseUrl)
    cohortsToCreate[[i]] <- tidyr::tibble(
      cohort_name = stringr::str_trim(stringr::str_squish(cohortDefinition$name)),
      cohort_id = cohortId,
      D = ifelse(cohortId %in% atlasTargetCohortIds, 'target', 'outcome')
    )
  }
  cohortsToCreate <- dplyr::bind_rows(cohortsToCreate)
  readr::write_excel_csv(
    x = cohortsToCreate,
    na = "",
    file = paste0(
      getPathToCsv(),
      "CohortsToCreate.csv"),
    append = FALSE
  )

  validJsons <- purrr::map_chr(
    purrr::map(atlasCohortIds,
               ~ROhdsiWebApi::getCohortDefinition(.x, baseUrl)), ~RJSONIO::toJSON(.x$expression, , pretty = T)
  )

  validSqls <-   purrr::map_chr(
    validJsons,
      ~CirceR::buildCohortQuery(CirceR::cohortExpressionFromJson(.x),
                                CirceR::createGenerateOptions(generateStats = FALSE)))
  purrr::walk(
    seq_along(cohortsToCreate$cohort_name), function(.x) {
    readr::write_lines(
      validSqls[[.x]], here::here(glue::glue(
        'inst/sql/sql_server/{cohortsToCreate$cohort_name[[.x]]}.sql'
      )
    ))
      readr::write_lines(
        validSqls[[.x]], glue::glue(
          here::here('inst/cohorts/{cohortsToCreate$cohort_name[[.x]]}.json'
        )
      ))

  })
}


#' @export
settingsGs <- function() {
  pathToCsv <- system.file(
    "settings",
    "CohortsToCreate.csv",
    package = getThisPackageName()
  )
  cohortsToCreate <- readr::read_csv(pathToCsv, col_types = readr::cols())

  targetIds <- cohortsToCreate %>% dplyr::filter(D == 'target') %>%
    dplyr::pull(cohort_id)
  outcomeIds <- cohortsToCreate %>% dplyr::filter(D == 'outcome') %>%
    dplyr::pull(cohort_id)

  return(
    list(
      targetIds = targetIds,
      outcomeIds = outcomeIds
    )
  )
}


