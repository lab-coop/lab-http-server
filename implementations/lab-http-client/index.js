'use strict';

module.exports = function LabHTTPClientFactory(container) {
  const implementationType = container['lab-config'].get('httpClient.type');
  if (implementationType === 'server') return container['lab-http-server'];
  else return container.getImplementation('lab-http-client', implementationType);
};

module.exports.type = 'factory';