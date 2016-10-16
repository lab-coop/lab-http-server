'use strict';
const co = require('co');
const compose = require('koa-compose');

module.exports = Object.freeze({
  processMiddlewares: co.wrap(processMiddlewares)
});

function* processMiddlewares(ctx, middlewares) {
  yield compose(middlewares)(ctx);
  return ctx;
};
