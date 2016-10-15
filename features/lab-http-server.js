'use strict';
const _ = require('lodash');
const { expect } = require('chai');

module.exports = function() {
  this.Before(function() {
    this.context = this.context || {};
    this.context.httpServer = {};
  });

  this.Given('an HTTP server listening', function() {
    const httpServer = this.container.get('httpServer');
    this.context.httpServer.instance = httpServer.createServer();
    this.context.httpServer.instance.start();
  });

  this.Given('the $verb $query HTTP route is defined', function(verb, query) {
    // assumes json
    this.context.httpServer.instance.registerRoute(verb, query, (ctx, next) => {
      ctx.body = { verb, query };
      return next();
    });
  });

  this.When('the $method $query HTTP query is processed', function (verb, query) {
    expect(this.context.httpServer.instance.sendRequest).to.be.a('function');
    return this.context.httpServer.instance.sendRequest(verb, query).then(res => {
      this.context.httpServer.response = res;
    });
  });

  this.Then('the HTTP response code is $status', function(status) {
    expect(this.context.httpServer.response.status).to.equal(parseInt(status));
  });

  this.Then('the HTTP response JSON contains that "$key" is "$value"', function(key, value) {
    expect(this.context.httpServer.response.body).to.be.an('object');
    expect(_.get(this.context.httpServer.response.body, key)).to.equal(value);
  })
};