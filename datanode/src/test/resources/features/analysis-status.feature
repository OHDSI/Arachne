Feature: Analysis Status Transitions and Callback Handling

  Background:
    Given User Homer Simpson exists
    When User "Homer Simpson" creates datasource "SpringfieldData"
    And User "Homer Simpson" uploads the necessary files

  Scenario: Analysis successfully executed
    When User "Homer Simpson" runs "MaggiesGrowth" analysis on datasource "SpringfieldData"
    And Waiting for analysis to be initialized
    Then Inspect "MaggiesGrowth" analysis
    And it has the following properties:
      | type                | IR         |
      | currentState->stage | INITIALIZE |
      | currentState->state | INITIALIZE |
      | error               | null       |

    Then Waiting for analysis to receive update 1
    And Inspect "MaggiesGrowth" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE |
      | currentState->state | EXECUTE |
    Then Waiting for analysis to receive update 2
    And Inspect "MaggiesGrowth" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE |
      | currentState->state | EXECUTE |
    Then Waiting for analysis to completed
    And Inspect "MaggiesGrowth" analysis
    And it has the following properties:
      | type                | IR        |
      | currentState->stage | COMPLETED |
      | currentState->state | COMPLETED |
      | error               | null      |

  Scenario: Analysis fails due to R execution issue
    When User "Homer Simpson" runs "BartsPrank" analysis on datasource "SpringfieldData"
    Then Waiting for analysis to be initialized
    Then Inspect "BartsPrank" analysis
    Then it has the following properties:
      | type                | IR         |
      | currentState->stage | INITIALIZE |
      | currentState->state | INITIALIZE |
      | error               | null       |

    Then Waiting for analysis to receive update 1
    And Inspect "BartsPrank" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE |
      | currentState->state | EXECUTE |
      | error               | null    |
    Then Waiting for analysis to completed
    And Inspect "BartsPrank" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE                                       |
      | currentState->state | FAILED                                        |
      | error               | Barts prank failed due to invalid prank data. |


  Scenario: Analysis aborted
    When User "Homer Simpson" runs "LisasResearch" analysis on datasource "SpringfieldData"
    And Waiting for analysis to be initialized
    Then Inspect "LisasResearch" analysis
    And it has the following properties:
      | type                | IR         |
      | currentState->stage | INITIALIZE |
      | currentState->state | INITIALIZE |
    Then Waiting for analysis to receive update 1
    And Inspect "LisasResearch" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE |
      | currentState->state | EXECUTE |
    Then User "Homer Simpson" cancels "LisasResearch" analysis
    And Inspect "LisasResearch" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE |
      | currentState->state | ABORT |
    Then Waiting for analysis to receive update 2
    And Inspect "LisasResearch" analysis
    And it has the following properties:
      | currentState->stage | ABORT |
      | currentState->state | ABORT |
    Then Waiting for analysis to completed
    And Inspect "LisasResearch" analysis
    And it has the following properties:
      | type                | IR      |
      | currentState->stage | ABORTED |
      | currentState->state | ABORTED |
      | error               | null    |