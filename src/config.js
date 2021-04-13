const Storage = require('./util/Storage')

module.exports = class Config extends Storage {
  _dotenv = require('dotenv')

  constructor() { 
    super()
    this._dotenv.config()
  }

  _custom_get_env_keys(type, keys = [{ env: undefined, key: undefined, type: undefined, file_system: undefined, default: undefined }]) {
    let config = {}
    for(let arg of keys) {
      let value = this._process.env[arg.env] || null

      if (typeof value === 'undefined' || value === null) {
        if (arg.default === null) continue
        value = arg.default
      }

      if (arg.type) switch (arg.type) {
        case "string":
          try {
            if (typeof value !== arg.type) value = value.toString()
          } catch (error) { value = arg.default }
          break;
        case "number":
          try {
            if (typeof value !== arg.type) value = parseInt(value) || arg.default
          } catch (error) { value = arg.default }
          break;
      }

      if (arg.file_system) {
        let path = this.get(type)
        value = this.read_file({ path: path, filename: value, encoding: 'utf-8' })        
      }

      config[arg.key] = value
    }
    return config;
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
    let keysConfig = [
      { env: "MYSQL_HOST", key: "host", type: "string", default: 'localhost' }, 
      { env: "MYSQL_PORT", key: "port", type: "number", default: 3306 },
      { env: "MYSQL_USER", key: "user", type: "string", default: 'root' },
      { env: "MYSQL_PASSWORD", key: "password", type: "string", default: "" },
      { env: "MYSQL_DATABASE", key: "database", type: "string", default: "" },
      { env: "MYSQL_TIMEOUT", key: "connectTimeout", type: "number", default: 12000 }
    ]
    let keysSslConfig = [
      { env: "MYSQL_CERT", key: "cert", type: "string", file_system: true, default: null },
      { env: "MYSQL_KEY", key: "key", type: "string", file_system: true, default: null }, 
      { env: "MYSQL_CA", key: "ca", type: "string", file_system: true, default: null },
      { env: "MYSQL_PFX", key: "pfx", type: "string", file_system: true, default: null }, 
      { env: "MYSQL_PASSPHRASE", key: "passphrase", type: "string", file_system: false, default: null }, 
      { env: "MYSQL_CRL", key: "crl", type: "string", file_system: true, default: null }, 
      { env: "MYSQL_CIPHERS", key: "chipers", type: "string", file_system: false, default: null}
    ]

    let config = this._custom_get_env_keys('mysql_ssl', keysConfig)
    let ssl = this._custom_get_env_keys('mysql_ssl', keysSslConfig)

    return (ssl instanceof Object && Object.keys(ssl).length) ? { ...config, ssl } : config;
  }

  static server() {
    let config = new this
    return config.server()
  }

  server() {
    let serverConfig = [
      { env: "HTTP_PROTOCOL", key: "protocol", type: "string", default: "http" },
      { env: "HTTP_HOST", key: "host", type: "string", default: "localhost" },
      { env: "HTTP_PORT", key: "port", type: "number", default: 3000 },
    ]
    let serverSSL = [
      { env: "HTTP_CERT", key: "cert", type: "string", file_system: true, default: null },
      { env: "HTTP_KEY", key: "key", type: "string", file_system: true, default: null },
      { env: "HTTP_PFX", key: "pfx", type: "string", file_system: true, default: null },
      { env: "HTTP_PASSPHRASE", key: "passphrase", type: "string", default: null }
    ]
    let middlewareConfig = [
      { env: "MAX_REQUEST_SECONDS", key: "max_request", type: "number", default: 20 },
      { env: "REQUEST_RESET_SECONDS", key: "request_second", type: "number", default: 60 }
    ]
    let cacheConfig = [
      { env: "SERVER_CACHE_CLEAR_SECOND", key: "cache_clear_time", type: "number", default: 3600 }
    ]

    let config = {
      server: this._custom_get_env_keys("server_ssl", serverConfig),
      ssl: this._custom_get_env_keys("server_ssl", serverSSL),
      middleware: this._custom_get_env_keys("server_ssl", middlewareConfig),
      cache: this._custom_get_env_keys(cacheConfig)
    }

    if (!Object.keys(config.ssl).length) delete config.ssl
    return config
  }
}