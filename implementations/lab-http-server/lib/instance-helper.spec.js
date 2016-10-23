'use strict';
const { expect } = require('chai');
const instanceHelper = require('./instance-helper');
describe('instance-helper', () => {
  describe('httpMethodShorthands', () => {
    it('should generate an object os method shorthands', () => {
      const shorthands = instanceHelper.httpMethodShorthands(() => {}, ['GET', 'POST']);
      expect(shorthands).to.have.keys('get', 'post');
    });

    it('should return partials where the first parameter is the verb', () => {
      let calls = [];
      const shorthands = instanceHelper.httpMethodShorthands(
          (...args) => calls.push(args), ['GET', 'POST']);
      shorthands.get('/x');
      expect(calls[0]).to.deep.equal(['get', '/x'])
    });

    it('should decorate the defaultObject if given', () => {
      const defaultObject = {};
      const shorthands = instanceHelper.httpMethodShorthands(() => {}, ['GET', 'POST'], defaultObject);
      expect(shorthands).to.equal(defaultObject);
      expect(defaultObject.get).to.equal(shorthands.get);
    })
  });
});