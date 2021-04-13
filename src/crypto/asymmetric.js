const Hash = require('./hash')

module.exports = class Asymmetric {
  crypto = require('crypto')

  rsa = {
    modulusLength: 1024,
    publicExponent: 0x10001,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc'
    }
  }

  constructor(args = {}) {
    if (args.algorithm) this.setCipher(args.algorithm || 'aes-256-cbc')
    if (args.passphrase) this.setPassphrase(args.passphrase, args.hash || false, args.hashAlgorithm)
    else throw new Error('asymmetric require passphrase\n\n\'When encoding public keys, it is recommended to use \'spki\'. When encoding private keys, it is recommended to use \'pkcs8\' with a strong passphrase, and to keep the passphrase confidential.\'\n\nhttps://nodejs.org/api/crypto.html#crypto_crypto_generatekeypairsync_type_options')
    if (args.keyLength) this.setKeyLength(args.keyLength)
    if (args.publicKey) this.setPublicKey(args.publicKey)
    if (args.privateKey) this.setPrivateKey(args.privateKey)
  }
  
  setCipher(cipher) {
    this.rsa.privateKeyEncoding.cipher = cipher
  }

  setPassphrase(passphrase, hash, hashAlgorithm) {
    if (hash) {
      let _hash = new Hash({ algorithm: hashAlgorithm })
      passphrase = _hash.update(passphrase)
    }

    this.passphrase = passphrase
    this.rsa.privateKeyEncoding.passphrase = passphrase
  }

  setKeyLength(length = 1024) {
    length = parseInt(length)
    this.rsa.modulusLength = length || 1024
  }

  setPublicKey(publicKey) {
    this.publicKey = publicKey
  }

  setPrivateKey(privateKey) {
    this.privateKey = privateKey
  }

  getKeysPair() {
    return this.crypto.generateKeyPairSync('rsa', this.rsa)
  }

  publicEncrypt(value, format = 'hex') {
    value = Buffer.from(value)
    value = this.crypto.publicEncrypt(this.publicKey, value)
    return value.toString(format)
  }

  privateDecrypt(value, format = 'hex') {
    value = Buffer.from(value, format)
    value = this.crypto.privateDecrypt({ key: this.privateKey, passphrase: this.passphrase }, value)
    return value.toString('utf-8')
  }
}