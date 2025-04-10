Feature: JavaScript Project

  Scenario: simple
    Given the project should be versioned in git
    And the GitHub token is valid
    And the project language should be JavaScript
    And nvm is properly configured
    And the project will use the "ESM" dialect
    When the project is scaffolded
    Then the core JavaScript files are present
    And core ignores are defined
    And the base git files should be present
    And github is configured
    And next-steps are added as issues on GitHub
    And husky is configured
#    And JavaScript ignores are defined
