'use strict';
const di = require('lab-di');
const path = require('path');

module.exports = function() {
  this.World = World;
};

function World() {
  this.container = di();
  this.container.registerDir(path.join(__dirname, '../dependencies'));

  require('../index')(this.container);
}