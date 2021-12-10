Feature: JavaScript Package

  Scenario: Modern JavaScript package
    Given the project should be versioned in git
    And the project language should be JavaScript
    And the project will use the "babel" dialect
    And nvm is properly configured
    And the GitHub token is valid
    When the project is scaffolded
    Then the package will have repository details defined
    And the package will have linting configured
    And transpilation will be configured
    And mocha has been configured for unit tests
    And npm is used for the package manager
    And the coverage badge is added to the readme

  Scenario: TypeScript package
    Given the project should be versioned in git
    And the project language should be JavaScript
    And the project will use the "typescript" dialect
    And nvm is properly configured
    And the GitHub token is valid
    When the project is scaffolded
    Then the package will have linting configured
    And the package will have typescript configured
    And the coverage badge is added to the readme
