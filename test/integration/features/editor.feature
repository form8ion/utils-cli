Feature: Editor

  @wip
  Scenario: JetBrains config for existing project
    Given a JetBrains IDE is in use
    And the "General Maintenance" scaffolder is chosen
    And the repository is initialized
    When the project is lifted
    Then runConfigurations are prevented from being ignored
    And existing vcs ignores remain
