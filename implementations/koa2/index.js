'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const fetch = require('node-fetch');
const url = require('url');

module.exports = function HTTPServerKoaImplementation() {
  return Object.freeze({
    createServer
  });

  function createServer(serverUrl='http://localhost:8080') {
    const App = new Koa(), router = new Router();
    const {protocol, host, port} = url.parse(serverUrl);
    let server;
    return Object.freeze({
      registerRoute,
      start,
      stop,
      sendRequest
    });

    function registerRoute(verb, path, ...middlewares) {
      router[verb.toLowerCase()].bind(router)(path, ...middlewares);
      console.log(`Registered ${verb} ${path} ${middlewares.length} middleware(s)...`);
    }

    function start() {
      App.use(bodyparser({}));
      App.use(router.routes());
      App.use(router.allowedMethods());
      server = App.listen(port);
      console.log('Listening on port', port);
    }

    function stop() {
      server.close();
      console.log('Stopped on port', port);
    }

    function sendRequest(method, query, {body, headers}={}) {
      return fetch(`${protocol}//${host}${query}`, {
        method, body, headers
      }).then(response => {
        return response.text().then(responseText => {
          return {
            status: response.status,
            body: responseText
          };
        });
      });
    }
  }
};