module.exports = class Middleware {
  _express = require('express')
  _app     = this._express()

  constructor() {}

  router() {}
  pages() {}
  get() {}

  static build() {
    let middleware = new this();
    return middleware.get();
  }
}