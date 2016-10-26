Feature:
  HTTP server

  As a dev I want to be able to respond to HTTP requests

  Background:
    Given an HTTP server exists
    And this HTTP server is started

  Scenario: The HTTP server responds with 404 Not Found
    When the GET /some/endpoint HTTP query is processed
    Then the HTTP response code is 404

  Scenario: The HTTP server has a registered route and responds to a query to it
    Given the GET /some/endpoint HTTP route is defined
    When the GET /some/endpoint HTTP query is processed
    Then the HTTP response code is 200
    Then the HTTP response JSON contains that "path" is "/some/endpoint"
    Then the HTTP response JSON contains that "verb" is "GET"

  Scenario: The HTTP server has a registered route but an invalid path is queried
    Given the GET /some/endpoint HTTP route is defined
    When the GET /some/other/endpoint HTTP query is processed
    Then the HTTP response code is 404

  Scenario: The HTTP server has a registered route but an invalid method is queried
    Given the PUT /some/post/endpoint HTTP route is defined
    When the POST /some/post/endpoint HTTP query is processed
    Then the HTTP response code is 405

  Scenario: The HTTP server has a registered endpoint, and it responds with a JSON
    Given the GET /resources/:resourceId/nested/:nestedId HTTP route is defined
    When the GET /resources/42/nested/1?option=7 HTTP query is processed
    Then the HTTP response code is 200
    Then the HTTP response JSON contains that "params.resourceId" is "42"
    Then the HTTP response JSON contains that "params.nestedId" is "1"
    Then the HTTP response JSON contains that "query.option" is "7"

  Scenario: The HTTP server receives a POST request without any data
    Given the POST /some/post/endpoint HTTP route is defined
    When the POST /some/post/endpoint HTTP query is processed
    Then the HTTP response code is 200
    Then the HTTP response JSON contains that "request.body" is empty

  Scenario: The HTTP server receives a POST request with some form data
    Given the POST /some/post/endpoint HTTP route is defined
    When the {"iAmJson": "yep"} JSON arrives to POST /some/post/endpoint
    Then the HTTP response code is 200
    Then the HTTP response body is of type string
    Then the HTTP response JSON contains that "request.body.iAmJson" is "yep"

  Scenario: The HTTP server has a middleware attached
    Given an in-memory logger middleware is defined
    Given this HTTP server is restarted
    When the GET /some/random/endpoint HTTP query is processed
    Then the in-memory logger middleware should have 1 logs

  Scenario: The HTTP server redirects to one of its other endpoints
    Given that GET /redirected HTTP redirects to /some/post/endpoint
    When the GET /redirected HTTP query is processed
    Then the HTTP response code is 302

  Scenario: The HTTP server redirects to the outside
    Given that GET /redirected HTTP redirects to http://example.com/does/not/exist
    When the GET /redirected HTTP query is processed
    Then the HTTP response code is 302

#  Scenario: The HTTP server redirects back
#    Given that GET /redirected HTTP redirects to back
#    When the GET /redirected HTTP query is processed
#    Then the HTTP response code is 302
#    Then the Location response header is http://localhost:8080/
