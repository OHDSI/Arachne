Feature: Analysis Status Transitions and Callback Handling

  Background:
    Given EE is initialized with tarball environments:
      | id  | bundleName | label |
      | one | mould-1935 | Mould |
    Given user Alex Fleming exists
    And User "Alex Fleming" creates datasource "Historic Data"
    And User "Alex Fleming" uploads the necessary files

  Scenario: Analysis completes successfully
    When user "Alex Fleming" runs "Staphylococcus" analysis on datasource "Historic Data"
    And EE accepts analysis "Staphylococcus" with descriptor "one"
    And EE sends update stage "INITIALIZE" stdout "Seed Staphylococcus"
    And EE sends update stage "EXECUTE" stdout "Go for a holiday"
    And EE sends update stage "EXECUTE" stdout "Observe mould preventing the bacteria around from growing"
    And EE sends result stage "COMPLETED" stdout "Identifed chemical produced by the mould"

    When analysis state history is inspected
    Then it is a list of:
      | command | stage      | error | state      |
      |         |            |       | INITIALIZE |
      |         | INITIALIZE |       | INITIALIZE |
      |         | EXECUTE    |       | EXECUTE    |
      |         | COMPLETED  |       | COMPLETED  |


  Scenario: Analysis fails due to execution issue
    Given user Howard Florey exists
    When user "Howard Florey" runs "Sepsis Treatment" analysis on datasource "Historic Data"
    And EE accepts analysis "Sepsis Treatment" with descriptor "one"
    And EE sends update stage "INITIALIZE" stdout "Patient infected with streptococcus"
    And EE sends update stage "EXECUTE" stdout "Injected penicillin, condition improved"
    And EE sends result stage "EXECUTE" error "Ran out of penicillin" stdout "Patient died"

    When analysis state history is inspected
    Then it is a list of:
      | command | stage      | error                 | state      |
      |         |            |                       | INITIALIZE |
      |         | INITIALIZE |                       | INITIALIZE |
      |         | EXECUTE    |                       | EXECUTE    |
      |         | EXECUTE    | Ran out of penicillin | FAILED     |

  Scenario: Analysis aborted by user during execution
    Given user Norman Heatley exists
    When user "Norman Heatley" runs "Penicillium notatum" analysis on datasource "Historic Data"
    And EE accepts with descriptor "one"
    And EE sends update stage "INITIALIZE" stdout "Use every available container to grow the mold"
    And EE sends update stage "EXECUTE" stdout "Mold grows too slowly"
    Then user "Norman Heatley" cancels "Penicillium notatum" analysis
    Then EE accepts cancel request
    And EE sends update stage "ABORT" stdout ""
    And EE sends analysis "Penicillium notatum" result stage "ABORTED" stdout "Aborted by request"

    When analysis state history is inspected
    Then it is a list of:
      | command | stage      | error | state      |
      |         |            |       | INITIALIZE |
      |         | INITIALIZE |       | INITIALIZE |
      |         | EXECUTE    |       | EXECUTE    |
      | ABORT   | EXECUTE    |       | ABORT      |
      |         | ABORT      |       | ABORT      |
      |         | ABORTED    |       | ABORTED    |

  Scenario: Analysis execution fails due to EE run method exception
    Given user Mary Hunt exists
    When user "Mary Hunt" runs "Buy vegetables" analysis on datasource "Historic Data"
    And EE rejects with error "Pretty golden mould"
    When analysis state history is inspected
    Then it is a list of:
      | command | stage | error               | state      |
      |         |       |                     | INITIALIZE |
      |         |       | Pretty golden mould | FAILED     |

  Scenario: Analysis aborted but completes successfully due to error during abort process
    Given user Norman Heatley exists
    When user "Norman Heatley" runs "Penicillium chrysogeum" analysis on datasource "Historic Data"
    And EE accepts with descriptor "one"
    And EE sends update stage "INITIALIZE" stdout "Initial yield 200 times mor than Penicillium notatum"
    And EE sends update stage "EXECUTE" stdout "X-Ray mutation"

    When user "Alex Fleming" cancels "Penicillium chrysogeum" analysis
    And EE rejects cancel request with error "Out of luck"
    And EE sends update stage "EXECUTE" stdout "Mutation complete"
    And EE sends result stage "COMPLETED" stdout "Penicillin yield increased 1000x"

    When analysis state history is inspected
    Then it is a list of:
      | command | stage      | error                  | state        |
      |         |            |                        | INITIALIZE   |
      |         | INITIALIZE |                        | INITIALIZE   |
      |         | EXECUTE    |                        | EXECUTE      |
      | ABORT   | EXECUTE    |                        | ABORT        |
      | ABORT   | EXECUTE    | Penicillium chrysogeum | ABORT_FAILED |
      |         | COMPLETED  |                        | COMPLETED    |
