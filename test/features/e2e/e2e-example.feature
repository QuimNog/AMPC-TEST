@task7
Feature: Retrieve the profile information of the logged-in user using an access token

  Scenario: Retrieve private information of a non-logged user - 401
  #step 1
    Given an "" API user with role ""
    When retrieving private information from user logged user
    Then status response is 401
  #step 2
    Given an "Authenticated" API user with role "admin"
    When retrieving private information from user logged user
    Then status response is 200
  #step 3
    When updating the following logged user information
      | field | value                   |
      | name  | Quim Noguer             |
      | bio   | May the 4th be with you |
    Then status response is 200
  #step 4 REVIEW UPDATE + CHECK TO DO IT DYNAMICALLY
    When retrieving private information from user logged user
    Then status response is 200
    Then response contains previously updated fields
      | field | value                   |
      | name  | Quim Noguer             |
      | bio   | May the 4th be with you |
  #step 5
    And query parameters are
      | key        | value   |
      | visibility | private |
    When retrieving repositories from logged user
    Then status response is 200
      #review how are we checking fields value! 
    Then response fields "visibility" values match "private"
    Then response fields "private" values match "true"
  #step 6
    When retrieving list of commits from public repository "non-existing-repo" from user "octocat"
    Then status response is 404
  #step 7
    When retrieving list of commits from "first" repository for logged user
    When retrieving list of commits from "last" repository for logged user
