Feature: Other Project Type

  Scenario: simple
    Given the project should be versioned in git
    And the GitHub token is valid
    And the project language should be Other
    When the project is scaffolded
    Then core ignores are defined
    And the base git files should be present
