module.exports = class MiddlewareUtil {
  http = require('http')
  https = require('https')

  static get_protocol(protocol = 'http', app, config) {
    let middlewareUtil = new this
    return middlewareUtil.get_protocol(protocol, app, config)
  }

  get_protocol(protocol = 'http', app, config) {
    switch (protocol) {
      case 'https':
        return this.https.createServer(config, app)
      case 'http':
      default:
        return this.http.createServer(app)
    }
  }
}