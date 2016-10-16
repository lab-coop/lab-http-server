'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const fetch = require('node-fetch');

module.exports = function HTTPServerKoaImplementation() {
  return Object.freeze({
    createServer
  });
  function createServer() {
    const App = new Koa(), router = new Router();
    let server, hostname = 'localhost', port = 12345;
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
      if (query[0] === '/') query = query.slice(1);
      return fetch(`http://${hostname}:${port}/${query}`, {
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