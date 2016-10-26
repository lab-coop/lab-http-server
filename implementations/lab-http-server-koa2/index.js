'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const fetch = require('node-fetch');
const url = require('url');
const { httpMethodShorthands } = require('../lab-http-server/lib/instance-helper');

module.exports = function HTTPServerKoaImplementation() {
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
      return fetch(`${protocol}//${host}${query}`, {
        method, body, headers, redirect: 'manual'
      }).then(response => {
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
  }
};