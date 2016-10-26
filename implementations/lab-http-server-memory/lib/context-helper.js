'use strict';
const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');
const querystring = require('querystring');

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
  query = query.split('?')[0];
  return _.find(routes, route =>
      route.method === verb.toLowerCase() &&
      route.pattern.test(query));
}

function findMethodNotAllowedRoute(routes, verb, query) {
  query = query.split('?')[0];
  return _.find(routes, route =>
      route.method !== verb.toLowerCase() &&
      route.pattern.test(query));
}

function getDefaultContext(route, localPart, body) {
  const [path, query] = localPart.split('?');
  const params = extractParams(route, path);
  const ctx = {
    params,
    query: querystring.parse(query),
    request: { body, params },
    response: {
      headers: {},
      redirect
    }
  };
  return ctx;

  function redirect(path) {
    ctx.status = ctx.status || 302;
    ctx.response.headers['location'] = path;
  }
}

function extractParams(route, query) {
  if (!route) return {};
  else return _.zipObject(route.paramKeys, route.pattern.exec(query).slice(1));
}
