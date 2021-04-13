const Hash = require('./hash')
const Asymmetric = require('./asymmetric')
const Symmetric = require('./symmetric')


module.exports = class Crypto {
  static Hash(args) {
    return new Hash(args)
  }

  static Asymmetric(args) {
    return new Asymmetric(args)
  }

  static Symmetric(args) {
    return new Symmetric(args)
  }
}