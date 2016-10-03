'use strict';

const Koa = require('koa');
const fetch = require('node-fetch');

module.exports = function HTTPServerKoaImplementation() {
  return Object.freeze({
    createServer
  });
  function createServer() {
    let hostname = 'localhost', port = 12345;
    const App = new Koa();
    return Object.freeze({
      start,
      sendRequest
    });

    function start() {
      App.listen(port);
    }

    function sendRequest(method, query) {
      return fetch(`http://${hostname}:${port}/${query}`, {method});
    }
  }
};