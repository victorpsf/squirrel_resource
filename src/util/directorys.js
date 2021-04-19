module.exports = {
  "dir": ["http", "controller", "service", "private", "public", "model", "pages", "api", "server_ssl", "mysql_ssl", "middleware", "mail"],
  "files": [
    { 
      name: ".env-example", 
      mount: true, 
      dir: "root", 
      content: `HTTP_PROTOCOL=http\n` + 
      `HTTP_HOST=127.0.0.1\n` + 
      `HTTP_PORT=3000\n\n` + 

      `HTTP_CERT=\n` + 
      `HTTP_KEY=\n` + 
      `HTTP_PFX=\n` + 
      `HTTP_PASSPHRASE=\n\n` + 

      `MAX_REQUEST_SECONDS=20\n` + 
      `REQUEST_RESET_SECONDS=60\n` +
      `SERVER_CACHE_CLEAR_SECOND=3600\n\n` + 

      `SERVER_SECRET=\n` + 
      `SERVER_PASSPHRASE=\n` + 
      `SERVER_IV=\n\n` + 

      `SMTP_HOST=\n` + 
      `SMTP_PORT=\n` +
      `SMTP_SERVICE=\n` +
      `SMTP_USER=\n` +
      `SMTP_PASS=\n\n` +

      `MYSQL_HOST=localhost\n` +
      `MYSQL_PORT=3306\n` + 
      `MYSQL_USER=root\n` +
      `MYSQL_PASSWORD=\n` +
      `MYSQL_DATABASE=\n\n` + 

      `MYSQL_TIMEOUT=18000\n` + 
      `MYSQL_CERT=\n` +
      `MYSQL_KEY=\n` + 
      `MYSQL_CA=\n` + 
      `MYSQL_PFX=\n` + 
      `MYSQL_PASSPHRASE=\n` +
      `MYSQL_CRL=\n` +
      `MYSQL_CIPHERS=\n`
    },
    { 
      name: "BaseModel.js", 
      mount: true, 
      dir: "model", 
      content: `const { Model } = require('squirrel_orm')\n` + 
               `const { Config } = require('squirrel_resource')` + 
               `\n\n` + 
               `module.exports = class BaseModel extends Model {\n` + 
               `  constructor() { super(Config.mysql()) }\n`+ 
               `}`
    },
    { 
      name: "index.js", 
      mount: true,
      dir: "api", 
      content: `const { Router } = require('squirrel_resource')` + 
               `\n\n` + 
               `module.exports = Router()`
    },
    { 
      name: "make", 
      mount: true, 
      dir: "root", 
      content: `const { Make } = require('squirrel_resource')` + 
               `\n\n` + 
               `Make.build()`
    },
    { 
      module: 'controller', 
      name: "[NAME]Controller.js", 
      mount: false, 
      dir: "controller", 
      content: {
        original: `const { BaseController } = require('squirrel_resource')` + 
                  `\n\n` +
                  `module.exports = class [NAME]Controller extends BaseController {\n` +
                  `  constructor(request, response) { super(request, response) }` +
                  `\n\n\n\n` + 
                  `}`,
        extended: `const [NAME]Service = require('../service/[NAME]Service.js')` + 
                  `\n\n` + 
                  `module.exports = class [NAME]Controller extends [NAME]Service {\n` + 
                  `  constructor(request, response) { super(request, response) }` + 
                  `\n\n\n\n` + 
                  `}`
      } 
    },
    { 
      module: 'service', 
      name: "[NAME]Service.js", 
      mount: false, 
      dir: "service", 
      content: `const { BaseController } = require('squirrel_resource')` + 
               `\n\n` + 
               `module.exports = class [NAME]Service extends BaseController {\n` +  
               `  constructor(request, response) { super(request, response) }` + 
               `\n\n\n\n` + 
               `}`
    },
    { 
      module: 'router', 
      name: "[NAME]Router.js", 
      mount: false, 
      dir: "api", 
      content: {
        original: `const { Router } = require('squirrel_resource')` + 
                  `\n\n` + 
                  `[NAMECONTROLLER]\n` + 
                  `[NAMESERVICE]` + 
                  `\n\n\n\n` + 
                  `module.exports = Router()`,
        extended: `const { Router } = require('squirrel_resource')` + 
                  `\n\n` + 
                  `module.exports = Router()`
      } 
    },
    { 
      module: 'model', 
      name: "[NAME]Model.js", 
      mount: false, 
      dir: "model", 
      content: `const BaseModel = require('./BaseModel.js')` + 
               `\n\n` + 
               `module.exports = class [NAME]Model extends BaseModel {\n` +
               `  // table name\n` + 
               `  table = ''\n` + 
               `  fields = {\n` +
               `    id: {\n` + 
               `      type: this.DataTypes.INTERGER,\n` + 
               `      auto_increment: true,\n` + 
               `      nullable: true,\n` + 
               `      primary_key: true\n` + 
               `    }\n` + 
               `  }` + 
               `\n\n` + 
               `  cast = {}` + 
               `\n\n` +
               `  relation = {}` + 
               `\n\n` + 
               `  constructor() { super() }` + 
               `\n\n` + 
               `}`
    },
    { 
      module: 'middleware', 
      name: "[NAME]Middleware.js", 
      mount: false, 
      dir: "middleware", 
      content: `module.exports = function (request, response, next) {\n` + 
               `  /**\n` + 
               `   * write your code in here\n` + 
               `   */` + 
               `\n\n` + 
               `  next()` + 
               `\n` + 
               `}`
    }
  ]
}