# lab-http-server

[![Build Status](https://travis-ci.org/lab-coop/lab-http-server.svg?branch=master)](https://travis-ci.org/lab-coop/lab-http-server)

## Setup

Install it `npm install lab-http-server lab-di`

Use it through `lab-di`:

```javascript
const container = require('lab-di')();
require('lab-http-server')(container);
const httpServer = container.get('lab-http-server');
```

## Usage

```javascript
const server = httpServer.createServer('http://localhost:5000');
server.get('/*', (ctx, next) => {
 ctx.body = 'Hello!'
 return next();
});
server.start();
```