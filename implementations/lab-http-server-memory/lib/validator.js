'use strict';

module.exports = Object.freeze({
  validateStarted(started, message) {
    if (started === true) return;
    throw new Error(message);
  }
});