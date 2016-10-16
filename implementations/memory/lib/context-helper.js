'use strict';
const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');

module.exports = Object.freeze({
  createRoute,
  findRoute,
  findMethodNotAllowedRoute,
  getContext
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

function getContext(route, path, query, body, status) {
  const params = extractParams(route, path);
  return Object.freeze({
    status: status || _.get(route, 'middlewares.length', 0) === 0 ? 404 : 200,
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
