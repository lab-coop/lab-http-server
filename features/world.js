'use strict';

module.exports = function() {
  this.World = World;
};

function World() {
  const config = Object.freeze({
    get: key => {
      switch (key) {
        // case 'httpServer.type': return 'memory';
        case 'httpServer.type': return 'koa';
        default: throw new Error(`Could not find config value for ${key}`)
      }
      return key === 'httpServer.type' ? 'memory' : undefined;
    }
  });
  let containerObject = {
    config,
    httpServer: require('../index')(config)
};
  this.container = Object.freeze({
    get(key) {
      return containerObject[key];
    }
  });
}