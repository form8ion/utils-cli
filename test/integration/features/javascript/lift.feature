Feature: Lift

  Scenario: project without codecov configured
    Given the repository is initialized
    And the repository is hosted on GitHub
    And the project language is "JavaScript"
    And the visibility of the project is "OSS"
    When codecov is configured for an existing project
    Then the coverage badge is added to the readme
