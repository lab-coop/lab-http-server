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
    const httpServer = this.container.get('lab-http-server');
    this.context.httpServer.instance = httpServer.createServer();
  });
  this.Given('this HTTP server is started', function() {
    this.context.httpServer.instance.start();
  });

  this.Given('this HTTP server is restarted', function() {
    this.context.httpServer.instance.stop();
    this.context.httpServer.instance.start();
  });

  this.Given('the $verb $query HTTP route is defined', function(verb, path) {
    this.context.httpServer.instance[verb.toLowerCase()](path, (ctx, next) => {
      ctx.response.body = {
        test: true,
        verb, path,
        query: ctx.query,
        params: ctx.params,
        request: {
          body: _.get(ctx, 'request.body')
        }
      };
      return next();
    });
  });

  this.Given('that $verb $query HTTP redirects to $redirectTo', function(verb, path, redirectTo) {
    this.context.httpServer.instance[verb.toLowerCase()](path, (ctx, next) => {
      ctx.response.redirect(redirectTo);
      return next();
    });
  });

  this.When('the $method $query HTTP query is processed', function (method, query) {
    const httpClient = this.container.get('lab-http-client');
    const httpServerInstance = this.context.httpServer.instance;
    return httpClient.sendRequest(httpServerInstance.getPath(query), {
      method: method.toUpperCase()
    }).then(res => {
      this.context.httpServer.response = res;
    });
  });

  this.When('the $json JSON arrives to $method $query', function (json, method, query) {
    const httpClient = this.container.get('lab-http-client');
    const httpServerInstance = this.context.httpServer.instance;
    return httpClient.sendRequest(httpServerInstance.getPath(query), {
      method: method.toUpperCase(),
      body: json,
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      this.context.httpServer.response = res;
    });
  });

  this.Then('the HTTP response code is $status', function(status) {
    expect(this.context.httpServer.response.status).to.equal(parseInt(status));
  });

  this.Then('the HTTP response body is of type $type', function(type) {
    expect(typeof this.context.httpServer.response.body).to.equal(type);
    console.log(`HTTP response body`, this.context.httpServer.response.body);
  });

  this.Then('the HTTP response JSON contains that "$key" is "$value"', function(key, value) {
    const json = ensureObject(this.context.httpServer.response.body);
    expect(_.get(json, key)).to.equal(value);
  });

  this.Then('the HTTP response JSON contains that "$key" is empty', function(key) {
    const json = ensureObject(this.context.httpServer.response.body);
    expect(_.get(json, key)).to.be.empty;
  });

  function ensureObject(value) {
    return typeof value === 'string' ? JSON.parse(value) : value;
  }

  this.Then('the $name response header is $value', function(name, value) {
    expect(this.context.httpServer.response.headers[name.toLowerCase()]).to.equal(value);
  });

  this.Then('the $name response header has been set', function(name) {
    expect(this.context.httpServer.response.headers[name.toLowerCase()]).to.be.ok;
  });

  this.Given('an in-memory logger middleware is defined', function() {
    this.context.httpServer.logs = [];
    this.context.httpServer.instance.use((ctx, next) => {
      let entry = [false, ctx];
      this.context.httpServer.logs.push(entry);
      return next().then(res => {
        entry[0] = true;
        return res;
      })
    })
  });

  this.Then('the in-memory logger middleware should have $logCount logs', function(logCount) {
    expect(this.context.httpServer.logs).to.have.length(logCount);
  });
};