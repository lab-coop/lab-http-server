'use strict';
const _ = require('lodash');
module.exports = function() {
  let updates = {};
  return Object.freeze({
    get: (key) => _.get(updates, key) || unknown(key),
    update: (key, value) => _.set(updates, key, value)
  });
};
function unknown(key) {
  throw new Error(`Unknown mock config value for key "${key}".`)
}