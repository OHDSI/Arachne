Feature: Analysis Status Transitions and Callback Handling

  Background:
    Given User Homer Simpson exists
    And User "Homer Simpson" creates datasource "SpringfieldData"
    And User "Homer Simpson" uploads the necessary files

  Scenario: Analysis completes successfully
    Given the following analyses:
      | title         | executionDelay | exceptionRun | exceptionAbort | exceptionFind |
      | MaggiesGrowth | 1000           | false        | false          | false         |
    And the following execution steps for "MaggiesGrowth":
      | stdout                                                            |
      | Initializing growth tracking for the population.                  |
      | Calculating growth rates and comparing them to expected averages. |
      | Growth data successfully recorded for Maggies cohort.             |
    When User "Homer Simpson" runs "MaggiesGrowth" analysis on datasource "SpringfieldData"
    Then Waiting for analysis to completed
    Then Inspect "MaggiesGrowth" analysis state history
    Then it is a list of:
      | command   | state      | stage      | error |
      | CREATED   | INITIALIZE |            |       |
      | EXECUTING | EXECUTE    |            |       |
      | UPDATE    | INITIALIZE | INITIALIZE |       |
      | UPDATE    | EXECUTE    | EXECUTE    |       |
      | UPDATE    | COMPLETED  | COMPLETED  |       |


  Scenario: Analysis fails due to execution issue
    Given the following analyses:
      | title      | exceptionRun | exceptionAbort | exceptionFind |
      | BartsPrank | false        | false          | false         |
    And the following execution steps for "BartsPrank":
      | stdout                                                               | error                                         |
      | Initializing prank detection for the population of pranksters.       |                                               |
      | Identifying potential pranks in the cohort based on historical data. | Barts prank failed due to invalid prank data. |
    When User "Homer Simpson" runs "BartsPrank" analysis on datasource "SpringfieldData"
    Then Waiting for analysis to completed
    Then Inspect "BartsPrank" analysis state history
    Then it is a list of:
      | command   | state      | stage      | error                                         |
      | CREATED   | INITIALIZE |            |                                               |
      | EXECUTING | EXECUTE    |            |                                               |
      | UPDATE    | INITIALIZE | INITIALIZE |                                               |
      | UPDATE    | EXECUTE    | EXECUTE    |                                               |
      | UPDATE    | FAILED     | EXECUTE    | Barts prank failed due to invalid prank data. |

  Scenario: Analysis aborted by user during execution
    Given the following analyses:
      | title         | exceptionRun | exceptionAbort | exceptionFind |
      | LisasResearch | false        | false          | false         |
    And the following execution steps for "LisasResearch":
      | stdout                                                |
      | Initializing research tracking for Lisas new project. |
      | Analyzing data patterns for the research subject.     |
      | Research data compilation underway.                   |
      | Testing hypotheses with collected data.               |
      | Research completed successfully for Lisas project.    |
    When User "Homer Simpson" runs "LisasResearch" analysis on datasource "SpringfieldData"
    Then Waiting for analysis to receive update 1
    Then User "Homer Simpson" cancels "LisasResearch" analysis
    Then Waiting for analysis to completed
    Then Inspect "LisasResearch" analysis state history
    Then it is a list of:
      | command   | state      | stage      | error |
      | CREATED   | INITIALIZE |            |       |
      | EXECUTING | EXECUTE    |            |       |
      | UPDATE    | INITIALIZE | INITIALIZE |       |
      | UPDATE    | EXECUTE    | EXECUTE    |       |
      | ABORTING  | ABORT      | EXECUTE    |       |
      | UPDATE    | EXECUTE    | EXECUTE    |       |
      | UPDATE    | ABORT      | ABORT      |       |
      | UPDATE    | ABORTED    | ABORTED    |       |

  Scenario: Analysis execution fails due to EE run method exception
    Given the following analyses:
      | title              | exceptionRun | exceptionAbort | exceptionFind |
      | HomersDietAnalysis | true         | false          | false         |
    And the following execution steps for "HomersDietAnalysis":
      | stdout                                                        |
      | Starting Homers diet tracking system.                         |
      | Evaluating the impact of donuts on Homers health.             |
      | Analysis complete: Homers diet shows a preference for donuts. |
    When User "Homer Simpson" runs "HomersDietAnalysis" analysis on datasource "SpringfieldData"
    Then Inspect "HomersDietAnalysis" analysis state history
    Then it is a list of:
      | command           | state      | stage | error |
      | CREATED           | INITIALIZE |       |       |
      | EXECUTION_FAILURE | FAILED     |       |       |

  Scenario: Analysis aborted but completes successfully due to error during abort process
    Given the following analyses:
      | title                | exceptionRun | exceptionAbort | exceptionFind |
      | MargeHouseholdBudget | false        | true           | false         |
    And the following execution steps for "MargeHouseholdBudget":
      | stdout                                                                  |
      | Initializing household budget tracking for Marge.                       |
      | Reviewing monthly grocery expenses.                                     |
      | Analysis complete: Marges budget shows efficiency but room for savings. |
    When User "Homer Simpson" runs "MargeHouseholdBudget" analysis on datasource "SpringfieldData"
    Then Waiting for analysis to receive update 1
    Then User "Homer Simpson" cancels "MargeHouseholdBudget" analysis
    Then Waiting for analysis to completed
    Then Inspect "MargeHouseholdBudget" analysis state history
    Then it is a list of:
      | command       | state      | stage      | error |
      | CREATED       | INITIALIZE |            |       |
      | EXECUTING     | EXECUTE    |            |       |
      | UPDATE        | INITIALIZE | INITIALIZE |       |
      | UPDATE        | EXECUTE    | EXECUTE    |       |
      | ABORTING      | ABORT      | EXECUTE    |       |
      | ABORT_FAILURE | FAILED     | EXECUTE    |       |
      | UPDATE        | COMPLETED  | COMPLETED  |       |
