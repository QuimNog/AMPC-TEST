@task5
Feature: Retrieve a list of repositories (both public and private) for the logged-in user.

  Scenario: Retrieve repositories of an authenticated user - 200
    Given an "Authenticated" API user with role "admin"
    And query parameters are
      | key        | value   |
      | visibility | private |
    When retrieving repositories from logged user
    Then status response is 200
    Then response fields "are" visible
      | name        |
      | owner       |
      | description |
    Then response fields "visibility" values match "private"
    Then response fields "private" values match "true"

  Scenario: Retrieve repositories of an authenticated user has not changed - 304
    Given an "Authenticated" API user with role "admin"
    When retrieving repositories from logged user
    Then status response is 200
    Then response fields "are" visible
      | name        |
      | owner       |
      | description |
    When retrieving private repositories using previous response header "Etag" value as header "If-None-Match"
    Then status response is 304

  Scenario: Retrieve repositories of an non-authenticated user - 401
    Given an "Unauthenticated" API user with role "admin"
    When retrieving repositories from logged user
    Then status response is 401

  Scenario: Retrieve private information without permissions, only returns public info - 200 (should probably be 403)
    Given an "Authenticated" API user with role "viewer"
    When retrieving repositories from logged user
    Then status response is 200
    Then response fields "are" visible
      | name        |
      | owner       |
      | description |
    Then response fields "visibility" values match "public"
    Then response fields "private" values match "false"

  Scenario: Retrieve repositories of an authenticated user with invalid query parameters - 422
    Given an "Authenticated" API user with role "admin"
    And query parameters are
      | key        | value   |
      | type       | public  |
      | visibility | private |
    When retrieving repositories from logged user
    Then status response is 422
