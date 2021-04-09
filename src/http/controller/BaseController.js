const { request, response } = require('express')

module.exports = class BaseController {
  constructor(req = request, res = response) {
    this.request  = req;
    this.response = res;
  }

  currentTime() {
    return (new Date()).getTime();
  }

  status(code) {
    this.response.status(code);
  }

  end() {
    this.response.end();
  }

  query() {
    return this.request.query || {};
  }
  
  body() {
    return this.request.body || {};
  }

  params() {
    return this.request.params || {};
  }

  all() {
    return Object.assign({}, this.query(), this.body(), this.params());
  }

  defaultResponseJSON(params = { code: '', message: '', result: undefined }, requestCode) {
    if (requestCode) this.status(requestCode);
    if (!params.code) params.code = 400;

    params.status = params.code >= 200 && params.code < 300 ? 'success': 'error';
    params.time   = this.currentTime();

    this.response.json(params);
    this.response.end();
  }

  static instance(request, response) {
    return new this(request, response)
  }
}