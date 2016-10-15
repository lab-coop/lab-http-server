'use strict';
const _ = require('lodash');
const { expect } = require('chai');

module.exports = function() {
  this.Before(function() {
    this.context = _.defaultsDeep(this.context, {httpServer: {}});
  });

  this.After(function() {
    _.get(this.context, 'httpServer.instance.stop', () => {})();
  });

  this.Given('an HTTP server exists', function() {
    const httpServer = this.container.get('httpServer');
    this.context.httpServer.instance = httpServer.createServer();
  });

  this.Given('this HTTP server is started', function() {
    return this.context.httpServer.instance.start();
  });

  this.Given('the $verb $query HTTP route is defined', function(verb, query) {
    // assumes json
    this.context.httpServer.instance.registerRoute(verb, query, (ctx, next) => {
      ctx.response.body = { test: true, verb, query, params: ctx.params };
      console.log('Called', verb, query);
      return next();
    });
  });

  this.When('the $method $query HTTP query is processed', function (verb, query) {
    return this.context.httpServer.instance.sendRequest(verb, query).then(res => {
      this.context.httpServer.response = res;
    });
  });

  this.Then('the HTTP response code is $status', function(status) {
    expect(this.context.httpServer.response.status).to.equal(parseInt(status));
  });

  this.Then('the HTTP response JSON contains that "$key" is "$value"', function(key, value) {
    const json = ensureObject(this.context.httpServer.response.body);
    expect(_.get(json, key)).to.equal(value);
  });

  function ensureObject(value) {
    return typeof value === 'string' ? JSON.parse(value) : value;
  }
};