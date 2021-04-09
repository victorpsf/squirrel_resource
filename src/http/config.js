const Storage = require('../util/Storage')

module.exports = class Config extends Storage {
  _dotenv = require('dotenv')

  constructor() { 
    super()
    this._dotenv.config()
  }

  /**
   * leitura da configuração pelo .env
   * 
   * @returns {host,port,user,password,database,ssl}
   */
  static mysql() {
    let config = new this
    return config.mysql()
  }

  mysql() {
    let config = {
      host: this._process.env.MYSQL_HOST || 'locahost',
      port: this._process.env.MYSQL_PORT || 3306,
      user: this._process.env.MYSQL_USER || 'root',
      database: this._process.env.MYSQL_DATABASE || '',
      connectTimeout: this._process.env.MYSQL_TIMEOUT
    }
    let ssl = {
      cert       : this._process.env.MYSQL_CERT,
      key        : this._process.env.MYSQL_KEY,
      ca         : this._process.env.MYSQL_CA,
      pfx        : this._process.env.MYSQL_PFX,
      passphrase : this._process.env.MYSQL_PASSPHRASE,
      crl        : this._process.env.MYSQL_CRL,
      ciphers    : this._process.env.MYSQL_CIPHERS
    }

  }
}