'use strict';

module.exports = function({sendRequest}) {
  return Object.freeze({sendRequest});
};

module.exports.deps = ['lab-http-server-memory'];
