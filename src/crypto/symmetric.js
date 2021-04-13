const Hash = require('./hash')

module.exports = class Symmetric {
  crypto = require('crypto')

  constructor(args = { }) {
    let { algorithm = 'aes-256-cbc', passphrase, hash, hashAlgorithm, iv, ivEncoding = 'hex' } = args

    this.setAlgorithm(algorithm)
    if (passphrase) this.setPassphrase(passphrase, hash, hashAlgorithm)
    else throw new Error('symmetric require passphrase')
    this.setIv(iv, ivEncoding)
  }

  setAlgorithm(algorithm) {
    this.algorithm = algorithm
  }

  setPassphrase(passphrase, hash = false, hashAlgorithm) {
    if (hash) {
      let _hash = new Hash({ algorithm: hashAlgorithm })
      passphrase = _hash.update(passphrase)
    }

    this.passphrase = passphrase
  }

  setIv(iv, ivEncoding) {
    if (Buffer.isBuffer(iv)) {
      this.iv = iv
      return
    }

    this.iv = Buffer.from(iv, ivEncoding)
  }

  infoAlgorithm() {
    return this.crypto.getCipherInfo(this.algorithm)
  }

  getScrypt() {
    let { keyLength, blockSize } = this.infoAlgorithm()

    return this.crypto.scryptSync(
      this.passphrase,
      'salt',
      keyLength,
      { blockSize: blockSize }
    )
  }

  getCipher() {
    return this.crypto.createCipheriv(
      this.algorithm,
      this.getScrypt(),
      this.iv
    )
  }

  getDecipher() {
    return this.crypto.createDecipheriv(
      this.algorithm,
      this.getScrypt(),
      this.iv
    )
  }

  concatBuffer(...args) {
    let concat = []
    for(let buffer of args.flat(Infinity)) 
      for(let byte of buffer) concat.push(byte)
    return Buffer.from(concat)
  }

  encrypt(value, format = 'hex') {
    let cipher = this.getCipher()

    value = this.concatBuffer(cipher.update(Buffer.from(value)), cipher.final())
    return value.toString(format)
  }

  decrypt(value, format = 'hex') {
    let decipher = this.getDecipher()

    value = this.concatBuffer(decipher.update(Buffer.from(value, format)), decipher.final())
    return value.toString('utf-8')
  }
}