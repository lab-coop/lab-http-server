'use strict';
const di = require('lab-di');
const path = require('path');

module.exports = function() {
  this.World = World;
};

function World() {
  this.container = di();
  this.container.registerDir(path.join(__dirname, '../dependencies'));

  this.container.get('lab-config').update('httpServer.type',
      process.env.LAB_HTTP_SERVER_TYPE || 'memory');

  require('../index')(this.container);
}