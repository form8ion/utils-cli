Feature: form8ion plugin

  Scenario: scaffold form8ion plugin
    Given the project should be versioned in git
    And the GitHub token is valid
    And the project language should be JavaScript
    And nvm is properly configured
    And the project will use the "ESM" dialect
    And the project will be a form8ion plugin
    When the project is scaffolded
