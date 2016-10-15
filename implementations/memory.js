'use strict';
const middlewareHelper = require('../lib/middleware-helper');
module.exports = function HTTPServerMemoryImplementation() {
  let routesByVerb = {
    get: {}
  };
  return Object.freeze({
    createServer: createInMemoryServer
  });
  function createInMemoryServer() {
    let started = false;
    return Object.freeze({
      registerRoute,
      start,
      sendRequest
    });

    function registerRoute(verb, path, ...middlewares) {
      routesByVerb[verb.toLowerCase()][path] = middlewares;
    }

    function start() {
      started = true;
    }

    function sendRequest(verb, query) {
      if (!started) {
        throw new Error('Trying to send a request to a non-started HTTP server');
      }
      console.log(`Fake ${verb} request sent to ${query}`);

      const middlewares = routesByVerb[verb.toLowerCase()][query] || [];
      const ctx = {
        status: middlewares.length === 0 ? 404 : 200
      };
      return middlewareHelper.processMiddlewares(ctx, middlewares);
    }
  }
};