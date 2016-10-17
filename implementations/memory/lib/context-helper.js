'use strict';
const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');

module.exports = Object.freeze({
  createRoute,
  findRoute,
  findMethodNotAllowedRoute,
  getDefaultContext,
  getStatus,
});

function createRoute(verb, path, middlewares) {
  const keys = [];
  const pattern = pathToRegexp(path, keys);

  return Object.freeze({
    method: verb.toLowerCase(),
    path,
    middlewares,
    paramKeys: keys.map(key => key.name),
    pattern
  });
}

function getStatus(routes, verb, query) {
  const route = findRoute(routes, verb, query);
  if (findMethodNotAllowedRoute(routes, verb, query)) return 405;
  return _.get(route, 'middlewares.length', 0) === 0 ? 404 : 200;
}

function findRoute(routes, verb, query) {
  return _.find(routes, route =>
      route.method === verb.toLowerCase() &&
      route.pattern.test(query));
}

function findMethodNotAllowedRoute(routes, verb, query) {
  return _.find(routes, route =>
      route.method !== verb.toLowerCase() &&
      route.pattern.test(query));
}

function getDefaultContext(route, path, query, body) {
  const params = extractParams(route, path);
  return Object.freeze({
    params,
    query,
    request: { body, params },
    response: {}
  });
}

function extractParams(route, query) {
  if (!route) return {};
  else return _.zipObject(route.paramKeys, route.pattern.exec(query).slice(1));
}
