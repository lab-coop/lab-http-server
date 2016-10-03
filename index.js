'use strict';

module.exports = function HTTPServerService(config) {
  const implementationType = config.get('httpServer.type');
  switch (implementationType) {
    case 'koa':
      return require('./implementations/koa2').call(undefined, arguments);
    case 'memory':
      return require('./implementations/memory').call(undefined, arguments);
  }
};
