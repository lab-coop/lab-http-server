'use strict';
const _ = require('lodash');
const HTTP_VERBS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const { httpMethodShorthands } = require('../lab-http-server/lib/instance-helper');
const middlewareHelper = require('./lib/middleware-helper');
const contextHelper = require('./lib/context-helper');

module.exports = function HTTPServerMemoryImplementation() {
  let routes, middlewares, started = false;
  return Object.freeze({
    createServer: createInMemoryServer,
    sendRequest
  });
  function createInMemoryServer() {
    routes = [];
    middlewares = [];
    return Object.freeze(httpMethodShorthands(registerRoute, HTTP_VERBS, {
      use: (middleware) => middlewares.push(middleware),
      getPath: path => path,
      start: () => started = true,
      stop: () => started = false,
    }));
  }

  function registerRoute(verb, path, ...middlewares) {
    routes.push(contextHelper.createRoute(verb, path, middlewares));
  }

  function sendRequest(path, {method, body, headers}={}) {
    if (!started) throw new Error(`HTTP server is not started when ${method}ing ${path}.`);
    const requestBody = middlewareHelper.parseBody(body, headers);
    const route = contextHelper.findRoute(routes, method, path);
    const ctx = contextHelper.getDefaultContext(route, path, requestBody);
    const routeMiddlewares = middlewares.concat(_.get(route, 'middlewares', []));
    return middlewareHelper.processMiddlewares(ctx, routeMiddlewares).then(() => ({
      headers: ctx.response.headers,
      status: ctx.status || contextHelper.getStatus(routes, method, path),
      body: JSON.stringify(ctx.response.body)
    }));
  }
}