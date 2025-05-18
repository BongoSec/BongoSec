Feature: Bongosec version information

  As a bongosec user
  I want to check the about information
  in order to see information about the system

  @about @actions
  Scenario: Check Bongosec version information
    Given The bongosec admin user is logged
    When The user navigates to About settings
    Then The Bongosec information is displayed
