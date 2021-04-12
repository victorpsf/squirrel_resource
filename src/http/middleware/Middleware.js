module.exports = class Middleware {
  _express = require('express')
  _app     = this._express()
  _config  = require('../../config')
  _util    = require('./MiddlewareUtil')
  _internal = { 
    count: 0,
    listenTime: 0,
    interval: null,
    listen: {
      max_request: 20,
      request_second: 60
    }
  }

  constructor() {
    this._app.use((...args) => this._newRequest(...args))
  }

  router(router) {
    this._app.use(router.build())
    return this
  }

  pages() {
    return this
  }

  openToRequest() {
    return (this._internal.count < this._internal.listen.max_request)
  }

  _newRequest(request, response, next) {
    if (!this.openToRequest()) {
      response.status(429)
      response.end()
      return;
    }
    
    this._internal.count++
    next()
  }

  _listenInterval() {
    this._internal.interval = setInterval(() => {
      this._internal.listenTime++
      if (this._internal.listenTime == this._internal.listen.request_second) {
        this._internal.count = 0
        this._internal.listenTime = 0
      }
    }, 1000);
  }

  listen(callback) {
    let config = this._config.server()
    let protocol = this._util.get_protocol(config.server.protocol, this._app, config.ssl)
    this._internal.listen = config.middleware
    this._listenInterval()

    protocol.listen(config.server, () => callback.apply(null, [config.server]))
    return protocol
  }

  static build() {
    let middleware = new this();
    return middleware
  }
}