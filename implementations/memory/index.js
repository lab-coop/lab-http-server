'use strict';
const _ = require('lodash');
const querystring = require('querystring');
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
    return Object.freeze({
      registerRoute,
      start: () => started = true,
      stop: () => started = false,
      sendRequest
    });

    function registerRoute(verb, path, ...middlewares) {
      routes.push(contextHelper.createRoute(verb, path, middlewares));
    }

    function sendRequest(verb, path, {body, headers}={}) {
      let [query, params] = path.split('?');
      body = middlewareHelper.parseBody(body, headers);
      params = querystring.parse(params);
      if (!started) {
        throw new Error(`HTTP server is not started when ${verb}ing ${path}.`);
      }

      const status = (contextHelper.findMethodNotAllowedRoute(routes, verb, query)) && 405;

      const route = contextHelper.findRoute(routes, verb, query);
      const ctx = contextHelper.getContext(route, query, params, body, status);
      const middlewares = _.get(route, 'middlewares', []);
      return middlewareHelper.processMiddlewares(ctx, middlewares).then(() => {
        return {
          status: status || ctx.status,
          body: JSON.stringify(ctx.response.body)
        }
      });
    }
  }
};