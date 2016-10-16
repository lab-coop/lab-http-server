'use strict';
const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');

module.exports = Object.freeze({
  createRoute,
  findRoute,
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

function getContext(route, query) {
  const params = extractParams(route, query);
  return Object.freeze({
    status: _.get(route, 'middlewares.length', 0) === 0 ? 404 : 200,
    params,
    request: { params },
    response: {}
  });
}

function extractParams(route, query) {
  if (!route) return {};
  else return _.zipObject(route.paramKeys, route.pattern.exec(query).slice(1));
}
