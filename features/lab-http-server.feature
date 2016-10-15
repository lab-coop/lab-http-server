Feature:
  HTTP server

  As a dev I want to be able to respond to HTTP requests

  Scenario: The HTTP server responds with 404 Not Found
    Given an HTTP server exists
    And this HTTP server is started
    When the GET /some/endpoint HTTP query is processed
    Then the HTTP response code is 404

  Scenario: The HTTP server has a registered route and responds to it
    Given an HTTP server exists
    And the GET /some/endpoint HTTP route is defined
    And this HTTP server is started
    When the GET /some/endpoint HTTP query is processed
    Then the HTTP response code is 200
    Then the HTTP response JSON contains that "query" is "/some/endpoint"
    Then the HTTP response JSON contains that "verb" is "GET"

  Scenario: The HTTP server has a registered endpoint, and it responds with a JSON
    Given an HTTP server exists
    And this HTTP server is started
    And the GET /some/endpoint HTTP route is defined
    When the GET /some/endpoint HTTP query is processed
    Then the HTTP response code is 200
    Then the HTTP response JSON contains that "query" is "/some/endpoint"
    Then the HTTP response JSON contains that "verb" is "GET"

