'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const url = require('url');
const { httpMethodShorthands } = require('../lab-http-server/lib/instance-helper');

module.exports = function HTTPServerKoa2Implementation() {
  return Object.freeze({
    createServer
  });

  function createServer(serverUrl='http://localhost:8080') {
    const App = new Koa(), router = new Router();
    const {protocol, host, port} = url.parse(serverUrl);
    let server;

    return Object.freeze(httpMethodShorthands(registerRoute, router.methods, {
      use: (middleware) => App.use(middleware),
      getPath: (query) => `${protocol}//${host}${query}`,
      start,
      stop
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
  }
};