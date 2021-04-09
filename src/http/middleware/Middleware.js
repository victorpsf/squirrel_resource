module.exports = class Middleware {
  _express = require('express')
  _app     = this._express()

  constructor() {}

  router(router) {
    this._app.use(router.build())
  }

  pages() {}

  get() {
    return this
  }

  listen(options, callback) {
    this._app.listen(options, callback)
    return this._app
  }

  static build() {
    let middleware = new this();
    return middleware.get();
  }
}