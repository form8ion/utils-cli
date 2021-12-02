Feature: Lift

  @wip
  Scenario: project without codecov configured
    When codecov is configured for an existing project
    Then the coverage badge is added to the readme
