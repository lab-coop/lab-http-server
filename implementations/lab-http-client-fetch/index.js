'use strict';
const fetch = require('node-fetch');

module.exports = function HTTPClientFetchImplementation() {
  return Object.freeze({
    sendRequest
  });

  function sendRequest(url, {method, body, headers}={}) {
    return fetch(url, {method, body, headers, redirect: 'manual'}).then(response => {
      const responseHeaders = {};
      response.headers.forEach((value, name) => responseHeaders[name] = value);
      return response.text().then(responseText => {
        return {
          status: response.status,
          headers: responseHeaders,
          body: responseText
        };
      });
    });
  }
};