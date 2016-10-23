'use strict';

module.exports = Object.freeze({
  httpMethodShorthands
});

function httpMethodShorthands(registerRoute, methods, defaultObject={}) {
  return methods.reduce((shorthands, method) => {
    const verb = method.toLowerCase();
    shorthands[verb] = (...args) => registerRoute(verb, ...args);
    return shorthands;
  }, defaultObject);
}
