Feature: Lift

  Scenario: project without codecov configured
    Given the repository is initialized
    When codecov is configured for an existing project
    Then the coverage badge is added to the readme
