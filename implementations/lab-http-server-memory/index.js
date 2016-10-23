'use strict';
const _ = require('lodash');
const middlewareHelper = require('./lib/middleware-helper');
const contextHelper = require('./lib/context-helper');

module.exports = function HTTPServerMemoryImplementation() {
  let routes;
  return Object.freeze({
    createServer: createInMemoryServer
  });
  function createInMemoryServer() {
    routes = [];
    let started = false;
    return Object.freeze(Object.assign(httpVerbs(registerRoute), {
      registerRoute,
      start: () => started = true,
      stop: () => started = false,
      sendRequest
    }));

    function registerRoute(verb, path, ...middlewares) {
      routes.push(contextHelper.createRoute(verb, path, middlewares));
    }

    function httpVerbs(fn, methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
      return methods
          .map(method => method.toLowerCase())
          .reduce((partials, verb) => Object.assign(partials, {
            [verb]: _.partial(fn, verb)
          }), {});
    }

    function sendRequest(verb, path, {body, headers}={}) {
      if (!started) throw new Error(`HTTP server is not started when ${verb}ing ${path}.`);
      const requestBody = middlewareHelper.parseBody(body, headers);
      const route = contextHelper.findRoute(routes, verb, path);
      const ctx = contextHelper.getDefaultContext(route, path, requestBody);
      const middlewares = _.get(route, 'middlewares', []);
      return middlewareHelper.processMiddlewares(ctx, middlewares).then(() => ({
        status: ctx.status || contextHelper.getStatus(routes, verb, path),
        body: JSON.stringify(ctx.response.body)
      }));
    }
  }
};