Feature:
  HTTP server

  As a dev I want to be able to respond to HTTP requests

  Scenario: The HTTP server responds
    Given an HTTP server listening
    When the GET /some/endpoint HTTP query is processed
    Then the HTTP response code is 404