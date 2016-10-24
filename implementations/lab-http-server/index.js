'use strict';

module.exports = function LabHTTPServerFactory(container) {
  const implementationType = container['lab-config'].get('httpServer.type');
  return container.getImplementation('lab-http-server', implementationType);
};

module.exports.type = 'factory';