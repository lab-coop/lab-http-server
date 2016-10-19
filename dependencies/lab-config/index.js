'use strict';

module.exports = function() {
  return Object.freeze({
    get: get
  });
};
function get(key) {
  switch (key) {
    case 'httpServer.type':
      return process.env.LAB_HTTP_SERVER_TYPE || 'memory';
    default:
      throw new Error(`Unknown mock config value for key "${key}".`)
  }
}