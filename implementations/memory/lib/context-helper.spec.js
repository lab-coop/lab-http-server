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
    it('should find a route which was queried ', () => {
      const route = contextHelper.createRoute('gEt', '/', (ctx, next) => next());
      expect(contextHelper.findMethodNotAllowedRoute([route], 'POST', '/')).to.be.ok;
    });
  });

  describe('getStatus', () => {
    it('should give 404 for no routes', () => {
      expect(contextHelper.getStatus([], 'GET', '/')).to.equal(404);
    });

    it('should give 404 if not found', () => {
      const postRoute = contextHelper.createRoute('POST', '/', (ctx, next) => next());
      expect(contextHelper.getStatus([postRoute], 'POST', '/other')).to.equal(404);
    });

    it('should give 200 for a matched route', () => {
      const postRoute = contextHelper.createRoute('POST', '/', (ctx, next) => next());
      expect(contextHelper.getStatus([postRoute], 'POST', '/')).to.equal(200);
    });

    it('should give 405 for an existing route queried with another method', () => {
      const getRoute = contextHelper.createRoute('GET', '/', (ctx, next) => next());
      expect(contextHelper.getStatus([getRoute], 'POST', '/')).to.equal(405);
    })
  });

  describe('getDefaultContext', () => {
    it('should create a context object from a route and a path', () => {
      const route = contextHelper.createRoute('GET', '/', (ctx, next) => next());
      const payload = {somePayload: true};
      const ctx = contextHelper.getDefaultContext(route, '/', payload);
      expect(ctx.query).to.be.equal(payload);
      expect(ctx.params).to.be.an('object');
      expect(ctx.request).to.be.an('object');
      expect(ctx.response).to.be.an('object');
    });
  });
});