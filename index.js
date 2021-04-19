module.exports = {
  Middleware: require('./src/http/middleware/Middleware'),
  Router: require('./src/http/router'),
  Storage: require('./src/util/Storage'),
  BaseController: require('./src/http/controller/BaseController'),
  Make: require('./src/util/Make'),
  Config: require('./src/config'),
  Validator: require('./src/util/Validator'),
  Crypto: require('./src/crypto/index'),
  Mailer: require('./src/smtp/smtp'),
  Utilities: require('./src/util/Utilities')
}