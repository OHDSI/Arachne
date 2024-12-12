Feature: Synchronize Analysis Status

  Background:
    Given EE is initialized with tarball environments:
      | id  | bundleName       | label       |
      | one | soil-sample-1943 | Soil Sample |
    Given user Selman Waksman exists
    And User "Selman Waksman" creates datasource "Bacterial Cultures"
    And User "Selman Waksman" uploads the necessary files

  Scenario: Synchronous analysis execution
    When user "Selman Waksman" runs "Streptomyces" analysis on datasource "Bacterial Cultures"
    And EE accepts analysis "Streptomyces" with descriptor "one"
    And Synchronize the analyses from EE
    And EE progresses to stage "INITIALIZE" with stdout "Extracting soil sample" and synchronize
    And EE progresses to stage "EXECUTE" with stdout "Cultivating actinobacteria" and synchronize
    And EE progresses to stage "EXECUTE" with stdout "Identifying growth inhibitors for tuberculosis bacteria" and synchronize
    And EE progresses to stage "COMPLETED" with stdout "Isolated active compound: Streptomycin" and synchronize
    When analysis state history is inspected
    Then it is a list of:
      | command | stage      | error | state      |
      |         |            |       | INITIALIZE |
      |         | INITIALIZE |       | INITIALIZE |
      |         | EXECUTE    |       | EXECUTE    |
      |         | COMPLETED  |       | COMPLETED  |

  Scenario: Synchronous analysis execution with missing information
    When user "Selman Waksman" runs "Streptomyces" analysis on datasource "Bacterial Cultures"
    And EE progresses to stage "COMPLETED" with stdout "Isolated active compound: Streptomycin"
    And Clear the list of analyses in EE
    And Synchronize the analyses from EE
    When analysis state history is inspected
    Then it is a list of:
      | command | stage      | error       | state      |
      |         |            |             | INITIALIZE |
      |         | INITIALIZE | UNAVAILABLE | FAILED     |