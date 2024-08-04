Feature: Other Project Type

  Scenario: simple
    Given the project should be versioned in git
    And the GitHub token is valid
    And the project language should be Other
    When the project is scaffolded
    Then core ignores are defined
    And the base git files should be present

  Scenario: public
    Given the project should be versioned in git
    And the project language should be Other
    And the visibility of the project is "Public"
    And the GitHub token is valid
    When the project is scaffolded
    Then the license should have been created
