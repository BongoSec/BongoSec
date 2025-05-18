Feature: API configuration instructions and connection validation

  As a bongosec user
  I want to check API configuration settings
  in order to see the instructions and test the connection

  @apiConfiguration
  Scenario: Check API configuration connection
    Given The bongosec admin user is logged
    When The user navigates to API configuration settings
    And The user checks API configuration connection
    Then The connection success toast is displayed

  @apiConfiguration
  Scenario: See API configuration instructions
    Given The bongosec admin user is logged
    When The user navigates to API configuration settings
    And The user tries to add new API configuration
    Then The instructions modal is displayed

  @apiConfiguration
  Scenario: See API configuration instructions
    Given The bongosec admin user is logged
    When The user navigates to API configuration settings
    And The user tries to add new API configuration
    And The user tests the API connection from the instructions
    Then The connection success check box is filled
