module.exports = class Middleware {
  _express = require('express')
  _app     = this._express()
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
    const Config = require('../../config')
    this._config = Config.server()
    const Cache = require('../../cache')
    this.cache = new Cache(this._config.cache)

    this._app.use((...args) => this._newRequest(...args))
    this._app.use((...args) => this._setCacheInRequest(...args))
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

  _setCacheInRequest(request, response, next) {
    request._cache = () => {
      return this.cache
    }
    next()
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
    let protocol = this._util.get_protocol(this._config.server.protocol, this._app, this._config.ssl)
    this._internal.listen = this._config.middleware
    this._listenInterval()

    protocol.listen(this._config.server, () => callback.apply(null, [this._config.server]))
    return protocol
  }

  static build() {
    let middleware = new this();
    return middleware
  }
}