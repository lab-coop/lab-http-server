Feature:
  HTTP server

  As a dev I want to be able to respond to HTTP requests

  Background:
    Given an HTTP server is started

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

  Scenario: The HTTP server receives a POST request without a form data
    Given the POST /some/post/endpoint HTTP route is defined
    When the POST /some/post/endpoint HTTP query is processed
    Then the HTTP response code is 200
    Then the HTTP response JSON contains no "response.body"

  Scenario: The HTTP server receives a POST request with some form data
    Given the POST /some/post/endpoint HTTP route is defined
    When POST data "collection[key]=value" arrives to /some/post/endpoint
    Then the HTTP response code is 200
    Then the HTTP response JSON contains that "request.body" is "collection[key]=value"
