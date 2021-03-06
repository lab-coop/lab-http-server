'use strict';
const diTools = require('lab-di/tools');
const attachHttpClient = require('lab-http-client');

module.exports = function() {
  this.World = World;
};

function World() {
  const diWrapper = diTools();

  require('../index')(diWrapper);

  this.container = diWrapper.getDI();
  this.container.registerModule(require('lab-config'), 'lab-config');
  this.container.registerModule(require('lab-config/implementations/memory'), 'lab-config-memory');
  const config = this.container.get('lab-config');
  config.update('httpServer.type', process.env.LAB_HTTP_SERVER_TYPE || 'memory');
  config.update('httpClient.type', process.env.LAB_HTTP_CLIENT_TYPE || 'memory');
  // config.update('httpServer.type', process.env.LAB_HTTP_SERVER_TYPE || 'koa2');
  // config.update('httpClient.type', process.env.LAB_HTTP_CLIENT_TYPE || 'fetch');

  attachHttpClient(this.container);
}
