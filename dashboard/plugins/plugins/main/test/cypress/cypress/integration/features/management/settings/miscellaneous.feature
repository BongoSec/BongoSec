Feature: Run health checks

  As a bongosec user
  I want to run the health check
  in order to validate everything is connected

  @miscellaneous @actions
  Scenario: Run health check
    Given The bongosec admin user is logged
    When The user navigates to Miscellaneous settings
    And The user runs the health checks
    Then The application navigates to the health checks page
