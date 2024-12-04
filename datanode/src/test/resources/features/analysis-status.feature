Feature: Analysis Status Transitions and Callback Handling

  Background:
    Given User Homer Simpson exists
    When User "Homer Simpson" creates datasource "SpringfieldData"
    And User "Homer Simpson" uploads the necessary files

  Scenario: Analysis successfully executed
    When User "Homer Simpson" runs "Maggie'sGrowth" analysis on datasource "SpringfieldData"
    And Waiting for analysis to be initialized
    Then Inspect "Maggie'sGrowth" analysis
    And it has the following properties:
      | type                | IR         |
      | currentState->stage | null       |
      | currentState->state | INITIALIZE |
      | error               | null       |

    Then Waiting for analysis to receive update 1
    And Inspect "Maggie'sGrowth" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE |
      | currentState->state | EXECUTE |
    Then Waiting for analysis to receive update 2
    And Inspect "Maggie'sGrowth" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE |
      | currentState->state | EXECUTE |
    Then Waiting for analysis to completed
    And Inspect "Maggie'sGrowth" analysis
    And it has the following properties:
      | type                | IR        |
      | currentState->stage | COMPLETED |
      | currentState->state | COMPLETED |
      | error               | null      |

  Scenario: Analysis fails due to R execution issue
    When User "Homer Simpson" runs "Bart'sPrank" analysis on datasource "SpringfieldData"
    Then Waiting for analysis to be initialized
    Then Inspect "Bart'sPrank" analysis
    Then it has the following properties:
      | type                | IR         |
      | currentState->stage | null       |
      | currentState->state | INITIALIZE |
      | error               | null       |

    Then Waiting for analysis to receive update 1
    And Inspect "Bart'sPrank" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE |
      | currentState->state | EXECUTE |
      | error               | null    |
    Then Waiting for analysis to completed
    And Inspect "Bart'sPrank" analysis
    And it has the following properties:
      | currentState->stage | EXECUTE                                                              |
      | currentState->state | FAILED                                                               |
      | error               | Bart's prank failed due to invalid prank data.                       |
