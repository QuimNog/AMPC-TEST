@task1
Feature: Retrieve the public profile information of a specific user without authentication

  @quim
  Scenario: Retrieve public information of a valid user - 200
    Given an "Unauthenticated" API user with role ""
    When retrieving public information from user "octocat"
    Then status response is 200
    Then response fields "are" visible
      | bio  |
      | name |
      | id   |
    Then response fields "are not" visible
      | private_gists             |
      | disk_usage                |
      | two_factor_authentication |

  Scenario: Retrieve public information of a non-existing user - 200
    Given an "Unauthenticated" API user with role ""
    When retrieving public information from user "USERNAME"
    Then status response is 404
