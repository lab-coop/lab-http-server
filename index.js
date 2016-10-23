'use strict';
const path = require('path');

module.exports = container => {
  container.registerDir(path.join(__dirname, '/implementations'));
};