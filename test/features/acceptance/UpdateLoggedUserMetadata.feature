@task6
Feature: Update the metadata of the logged-in user using an access token.

  Scenario: Sucessfully update a user - 200
    Given an "Authenticated" API user with role "admin"
    When updating the following logged user information
      | field | value       |
      | name  | testing1234 |
      | bio   | testing1234 |
    Then status response is 200

  Scenario: Retrieve private information of a logged user has not changed - 412
    Given an "Authenticated" API user with role "admin"
    When updating the following logged user information
      | field | value       |
      | name  | testing1234 |
      | bio   | testing1234 |
    Then status response is 200
    When updating the following information using previous response header "Etag" value as header "If-None-Match"
      | field | value       |
      | name  | testing1234 |
      | bio   | testing1234 |
    Then status response is 412

  Scenario: Unable to update a user, as there is no authentication - 401
    Given an "Unautheticated" API user with role "admin"
    When updating the following logged user information
      | field | value       |
      | name  | testing1234 |
      | bio   | testing1234 |
    Then status response is 401

  Scenario: Unable to update a user, as permissions are not enough - 403
    Given an "Authenticated" API user with role "viewer"
    When updating the following logged user information
      | field | value       |
      | name  | testing1234 |
      | bio   | testing1234 |
    Then status response is 404
