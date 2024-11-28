@task4
Feature: Retrieve a list of public repositories for a user

  Scenario: Retrieve public repositories of a valid user - 200
    Given an "Unauthenticated" API user with role ""
    When retrieving public repositories from user "octocat"
    Then status response is 200
    Then response fields "are" visible
      | name        |
      | owner       |
      | description |
    Then response fields "visibility" values match "public"
    Then response fields "private" values match "false"
        #missing model field validation

  Scenario: Retrieve public information of a non-existing user - 200
    Given an "Unauthenticated" API user with role ""
    When retrieving public repositories from user "USERNAME"
    Then status response is 404
