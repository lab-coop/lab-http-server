'use strict';
const _ = require('lodash');
const HTTP_VERBS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const { httpMethodShorthands } = require('../lab-http-server/lib/instance-helper');
const middlewareHelper = require('./lib/middleware-helper');
const contextHelper = require('./lib/context-helper');

module.exports = function HTTPServerMemoryImplementation() {
  let routes, middlewares;
  return Object.freeze({
    createServer: createInMemoryServer
  });
  function createInMemoryServer() {
    routes = [], middlewares = [];
    let started = false;
    return Object.freeze(httpMethodShorthands(registerRoute, HTTP_VERBS, {
      use: (middleware) => middlewares.push(middleware),
      start: () => started = true,
      stop: () => started = false,
      sendRequest
    }));

    function registerRoute(verb, path, ...middlewares) {
      routes.push(contextHelper.createRoute(verb, path, middlewares));
    }

    function sendRequest(verb, path, {body, headers}={}) {
      if (!started) throw new Error(`HTTP server is not started when ${verb}ing ${path}.`);
      const requestBody = middlewareHelper.parseBody(body, headers);
      const route = contextHelper.findRoute(routes, verb, path);
      const ctx = contextHelper.getDefaultContext(route, path, requestBody);
      const routeMiddlewares = middlewares.concat(_.get(route, 'middlewares', []));
      return middlewareHelper.processMiddlewares(ctx, routeMiddlewares).then(() => ({
        headers: ctx.response.headers,
        status: ctx.status || contextHelper.getStatus(routes, verb, path),
        body: JSON.stringify(ctx.response.body)
      }));
    }
  }
}