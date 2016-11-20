'use strict';
const path = require('path');
module.exports = (di) => {
  di.registerDir(path.join(__dirname, '/implementations'));
};
