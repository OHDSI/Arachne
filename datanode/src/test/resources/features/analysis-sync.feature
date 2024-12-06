Feature: Analysis Status Transitions and Callback Handling

  Background:
    Given User Homer Simpson exists
    When User "Homer Simpson" creates datasource "SpringfieldData"
    And User "Homer Simpson" uploads the necessary files
    Given the following analyses:
      | title                 | exceptionRun | exceptionAbort | exceptionFind |
      | HomersBeerConsumption | false        | false          | false         |
    And the following execution steps for "HomersBeerConsumption":
      | stdout                                                        |
      | Starting Homers beer consumption tracking system.             |
      | Monitoring Homers daily beer intake patterns.                 |
      | Completing analysis: Homers beer intake affects his behavior. |

  Scenario: Synchronous analysis execution
    Given Disables EE callbacks
    When User "Homer Simpson" runs "HomersBeerConsumption" analysis on datasource "SpringfieldData"
    And Waiting for analysis to be initialized
    Then Sync analyses
    Then Inspect "HomersBeerConsumption" analysis
    Then Waiting for analysis to receive update 1
    Then Sync analyses
    Then Waiting for analysis to receive update 2
    Then Sync analyses
    Then Waiting for analysis to completed
    Then Sync analyses
    Then Inspect "HomersBeerConsumption" analysis state history
    Then it is a list of:
      | command   | state      | stage      | error |
      | CREATED   | INITIALIZE |            |       |
      | EXECUTING | EXECUTE    |            |       |
      | UPDATE    | INITIALIZE | INITIALIZE |       |
      | UPDATE    | EXECUTE    | EXECUTE    |       |
      | UPDATE    | COMPLETED  | COMPLETED  |       |

  Scenario: Synchronous analysis execution with missing information
    Given Disables EE callbacks
    When User "Homer Simpson" runs "HomersBeerConsumption" analysis on datasource "SpringfieldData"
    And Waiting for analysis to completed
    And Remove info about analyses on EE
    And Sync analyses
    Then Inspect "HomersBeerConsumption" analysis state history
    Then it is a list of:
      | command   | state      | stage      | error       |
      | CREATED   | INITIALIZE |            |             |
      | EXECUTING | EXECUTE    |            |             |
      | UPDATE    | FAILED     | INITIALIZE | UNAVAILABLE |