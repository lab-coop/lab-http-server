'use strict';
const validator = require('./validator');
const {expect} = require('chai');

describe('validator', () => {
  describe('#validateStarted', () => {
    it('should do nothing given true', () => {
      expect(() => validator.validateStarted(true)).not.to.throw();
    });

    it('should throw otherwise', () => {
      expect(() => validator.validateStarted('anythingElse', 'Error message'))
        .to.throw('Error message');
    });
  });
});