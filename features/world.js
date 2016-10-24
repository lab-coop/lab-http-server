'use strict';
const di = require('lab-di');
const path = require('path');

module.exports = function() {
  this.World = World;
};

function World() {
  this.container = di();
  this.container.registerDir(path.join(__dirname, '../dependencies'));

  const config = this.container.get('lab-config');
  // config.update('httpServer.type', process.env.LAB_HTTP_SERVER_TYPE || 'memory');
  // config.update('httpClient.type', process.env.LAB_HTTP_CLIENT_TYPE || 'server');
  config.update('httpServer.type', process.env.LAB_HTTP_SERVER_TYPE || 'koa2');
  config.update('httpClient.type', process.env.LAB_HTTP_CLIENT_TYPE || 'fetch');


  require('../index')(this.container);
}