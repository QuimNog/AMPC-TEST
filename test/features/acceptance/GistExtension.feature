Feature: Create a gist

  Scenario: Create a valid gist - 200
    Given an "Authenticated" API user with role "admin"
    When creating a gist with following information
    Then status response is 201

  @task8
  Scenario: Comment gist
    Given an "Authenticated" API user with role "admin"
    When commenting "ññññ" to gist with id "fc00e7ff5469988b62b7594666f00a44"
    Then status response is 201
