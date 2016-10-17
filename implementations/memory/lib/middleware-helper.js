'use strict';
const co = require('co');
const compose = require('koa-compose');

module.exports = Object.freeze({
  processMiddlewares: co.wrap(processMiddlewares),
  parseBody,
});

function* processMiddlewares(ctx, middlewares) {
  yield compose(middlewares)(ctx);
  return ctx;
};

function parseBody(body, headers={}) {
  return (headers['Content-Type'] === 'application/json') ? JSON.parse(body) : body;
}