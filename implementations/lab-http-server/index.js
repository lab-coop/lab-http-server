'use strict';

module.exports = function LabHTTPServerFactory(container) {
  const implementationType = container['lab-config'].get('httpServer.type');
  return container[`lab-http-server-${implementationType}`];
};

module.exports.type = 'factory';