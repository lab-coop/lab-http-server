'use strict';

module.exports = function HTTPServerMemoryImplementation() {
  return Object.freeze({
    createServer: createInMemoryServer
  });
  function createInMemoryServer() {
    return Object.freeze({
      start: () => {},
      sendRequest
    });

    function sendRequest(method, query) {
      return new Promise((resolve) => {
        let res = {};
        res.status = 404;
        resolve(res);
      });
    }
  }
};