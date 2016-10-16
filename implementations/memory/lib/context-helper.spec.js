'use strict';
const contextHelper = require('./context-helper');
const {expect} = require('chai');

describe('context-helper', () => {
  describe('findRoute', () => {
    it('should return undefined if not found', () => {
      expect(contextHelper.findRoute([], 'GeT', '/')).to.be.undefined;
    });
    it('should find in a regexp-pattern-indexed object', () => {
      const route = contextHelper.createRoute('gEt', '/', (ctx, next) => next());
      expect(contextHelper.findRoute([route], 'GeT', '/')).to.be.ok;
    });
  });

  describe('findMethodNotAllowedRoute', () => {
    it('should return undefined if not found', () => {
      expect(contextHelper.findMethodNotAllowedRoute([], 'GeT', '/')).to.be.undefined;
    });
    it('should return undefined it the HTTP verb matches', () => {
      const route = contextHelper.createRoute('gEt', '/', (ctx, next) => next());
      expect(contextHelper.findMethodNotAllowedRoute([route], 'GeT', '/')).not.to.be.ok;
    });
    it('should find a route which was querid ', () => {
      const route = contextHelper.createRoute('gEt', '/', (ctx, next) => next());
      expect(contextHelper.findMethodNotAllowedRoute([route], 'POST', '/')).to.be.ok;
    });
  });

  describe('getContext', () => {
    it('should create a context object from a route and a path', () => {
      const route = contextHelper.createRoute('GET', '/', (ctx, next) => next());
      const ctx = contextHelper.getContext(route, '/');
      expect(ctx.status).to.be.a.number;
      expect(ctx).to.be.an.object;
      expect(ctx.params).to.be.an.object;
      expect(ctx.request).to.be.an.object;
      expect(ctx.response).to.be.an.object;
      expect(ctx.middlewares).to.be.an.array;
    });
  });
});