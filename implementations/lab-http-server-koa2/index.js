'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const url = require('url');
const { httpMethodShorthands } = require('../lab-http-server/lib/instance-helper');

module.exports = HTTPServerKoa2Implementation;
module.exports.deps = ['lab-http-client-fetch'];

function HTTPServerKoa2Implementation(httpClient) {
  return Object.freeze({
    createServer
  });

  function createServer(serverUrl='http://localhost:8080') {
    const App = new Koa(), router = new Router();
    const {protocol, host, port} = url.parse(serverUrl);
    let server;

    return Object.freeze(httpMethodShorthands(registerRoute, router.methods, {
      use: App.use.bind(App),
      start,
      stop,
      sendRequest
    }));

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
      return httpClient.sendRequest(`${protocol}//${host}${query}`, {method, body, headers});
    }
  }
}