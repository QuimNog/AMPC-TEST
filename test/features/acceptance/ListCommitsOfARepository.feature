@task3
Feature: Retrieve a list of public repositories for a user

  Scenario: Retrieve list of commits for an existing repo and a valid user - 200
    Given an "Unauthenticated" API user with role ""
    When retrieving list of commits from public repository "boysenberry-repo-1" from user "octocat"
    Then status response is 200
    Then response fields "are" visible
      | commit.author.name |
      | sha                |
      | committer.login    |

  Scenario: Retrieve list of all commits for an existing repo and valid user - 200
    Given an "Authenticated" API user with role "admin"
    When retrieving all commits from public repository "boysenberry-repo-1" from user "octocat"
    Then status response is 200

  Scenario: Retrieve list of commits for a non existing repo and a valid user - 404
    Given an "Unauthenticated" API user with role ""
    When retrieving list of commits from public repository "non-existing-repo" from user "octocat"
    Then status response is 404

  Scenario: Retrieve list of commits for an empty repository - 409
    Given an "Unauthenticated" API user with role ""
    When retrieving list of commits from public repository "ThisIsADummyRepo" from user "QuimNog"
    Then status response is 409
