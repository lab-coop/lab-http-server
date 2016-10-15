'use strict';
const _ = require('lodash');
const middlewareHelper = require('../lib/middleware-helper');
const pathToRegexp = require('path-to-regexp');
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
      const keys = [];
      const pattern = pathToRegexp(path, keys);
      routes.push({
        method: verb.toLowerCase(),
        path,
        middlewares,
        paramKeys: keys.map(key => key.name),
        pattern
      })
    }

    function findRoute(verb, query) {
      return _.find(routes, route =>
          route.method === verb.toLowerCase() &&
          route.pattern.exec(query));
    }

    function sendRequest(verb, queryString) {
      const [query] = queryString.split('?');
      if (!started) {
        throw new Error('Trying to send a request to a non-started HTTP server');
      }
      const route = findRoute(verb, query);
      const params = route ? extractParams(route, query) : {};
      const ctx = {
        status: _.get(route, 'middlewares.length', 0) === 0 ? 404 : 200,
        params,
        request: { params },
        response: {}
      };
      const middlewares = _.get(route, 'middlewares', []);
      return middlewareHelper.processMiddlewares(ctx, middlewares).then(() => {
        return {
          status: ctx.status,
          body: ctx.response.body
        }
      });
    }

    function extractParams(route, query) {
      if (!route) return {};
      else return _.zipObject(route.paramKeys, route.pattern.exec(query).slice(1));
    }
  }
};