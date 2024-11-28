@task2
Feature: Retrieve the profile information of the logged-in user using an access token

  Scenario: Retrieve private information of a logged user - 200
    Given an "Authenticated" API user with role "admin"
    When retrieving private information from user logged user
    Then status response is 200
    Then response fields "are" visible
      | bio                       |
      | name                      |
      | id                        |
      | private_gists             |
      | disk_usage                |
      | two_factor_authentication |

  Scenario: Retrieve private information of a logged user has not changed - 304
    Given an "Authenticated" API user with role "admin"
    When retrieving private information from user logged user
    Then status response is 200
    Then response fields "are" visible
      | bio                       |
      | name                      |
      | id                        |
      | private_gists             |
      | disk_usage                |
      | two_factor_authentication |
    When retrieving private profile using previous response header "Etag" value as header "If-None-Match"
    Then status response is 304

  Scenario: Retrieve private information of a non-logged user - 401
    Given an "Unauthenticated" API user with role ""
    When retrieving private information from user logged user
    Then status response is 401
    Then response fields "are not" visible
      | bio                       |
      | name                      |
      | id                        |
      | private_gists             |
      | disk_usage                |
      | two_factor_authentication |

  Scenario: Retrieve private information without permissions, only returns public info - 200 (should probably be 403)
    Given an "Authenticated" API user with role "viewer"
    When retrieving private information from user logged user
    Then status response is 200
    Then response fields "are" visible
      | bio  |
      | name |
