'use strict';
const middlewareHelper = require('./middleware-helper');
const {expect} = require('chai');

describe('middleware-helper', () => {
  describe('processMiddlewares', () => {
    it('should return a thenable', () => {
      expect(middlewareHelper.processMiddlewares({}, []).then).to.be.a('function');
    });

    it('should run all the middlewares in the array', (cb) => {
      let ctx = {};
      let calls = 0;
      let middleware = (ctx, next) => {
        ctx.body = 'body';
        calls++;
        return next();
      };
      middlewareHelper.processMiddlewares(ctx, [middleware, middleware]).then(_ctx => {
        expect(ctx).to.equal(_ctx);
        expect(ctx.body).to.equal('body');
        expect(calls).to.equal(2);
        cb();
      });
    })
  });
});