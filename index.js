'use strict';

module.exports = function HTTPServerService(config) {
  const implementationType = config.get('httpServer.type');
  return getImplementation(implementationType)(...arguments);

  function getImplementation(implementationType) {
    switch (implementationType) {
      case 'koa2':
        return require('./implementations/koa2');
      case 'memory':
        return require('./implementations/memory');
      default:
        throw new Error(`Could not find ${implementationType} implementation.`);
    }
  }
};
