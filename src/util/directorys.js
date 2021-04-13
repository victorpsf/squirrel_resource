module.exports = {
  "dir": ["http", "controller", "service", "private", "public", "model", "pages", "api", "server_ssl", "mysql_ssl", "middleware"],
  "files": [
    { name: ".env-example", mount: true, dir: "root", content: "HTTP_PROTOCOL=http\nHTTP_HOST=127.0.0.1\nHTTP_PORT=3000\n\nMAX_REQUEST_SECONDS=20\nREQUEST_RESET_SECONDS=60\nSERVER_CACHE_CLEAR_SECOND=3600\n\nSERVER_SECRET=\nSERVER_PASSPHRASE=\n\nHTTP_CERT=\nHTTP_KEY=\nHTTP_PFX=\nHTTP_PASSPHRASE=\n\n\nMYSQL_HOST=localhost\nMYSQL_PORT=3306\nMYSQL_USER=root\nMYSQL_PASSWORD=\nMYSQL_DATABASE=\nMYSQL_TIMEOUT=18000\n\nMYSQL_CERT=\nMYSQL_KEY=\nMYSQL_CA=\nMYSQL_PFX=\nMYSQL_PASSPHRASE=\nMYSQ_CRL=\nMYSQL_CIPHERS=" },
    { name: "BaseModel.js", mount: true, dir: "model", content: "const { Model } = require('squirrel_orm')\nconst { Config } = require('squirrel_resource')\n\nmodule.exports = class BaseModel extends Model {\n  constructor() {\n    super(Config.mysql())\n  }\n}" },
    { name: "index.js", mount: true, dir: "api", content: "const { Router } = require('squirrel_resource')\n\nmodule.exports = Router()" },
    { name: "make", mount: true, dir: "root", content: "const { Make } = require('squirrel_resource')\n\nMake.build()" },
    { module: 'controller', name: "[NAME]Controller.js", mount: false, dir: "controller", content: {
        original: "const { BaseController } = require('squirrel_resource')\n\nmodule.exports = class [NAME]Controller extends BaseController {\n  constructor(request, response) { super(request, response) }\n\n\n\n}",
        extended: "const [NAME]Service = require('../service/[NAME]Service.js')\n\nmodule.exports = class [NAME]Controller extends [NAME]Service {\n  constructor(request, response) { super(request, response) }\n\n\n\n}"
      } 
    },
    { module: 'service', name: "[NAME]Service.js", mount: false, dir: "service", content: "const { BaseController } = require('squirrel_resource')\n\nmodule.exports = class [NAME]Service extends BaseController {\n  constructor(request, response) { super(request, response) }\n\n\n\n}" },
    { module: 'router', name: "[NAME]Router.js", mount: false, dir: "api", content: {
        original: "const { Router } = require('squirrel_resource')\n\n[NAMECONTROLLER]\n[NAMESERVICE]\n\n\nmodule.exports = Router()",
        extended: "const { Router } = require('squirrel_resource')\n\nmodule.exports = Router()"
      } 
    },
    { module: 'model', name: "[NAME]Model.js", mount: false, dir: "model", content: "const BaseModel = require('./BaseModel.js')\n\nmodule.exports = class [NAME]Model extends BaseModel {\n  // table\n  table = ''\n  fields = {\n    id: {\n      type: this.DataTypes.INTERGER,\n      auto_increment: true,\n      nullable: true,\n      primary_key: true\n    }\n  }\n\n  cast = {}\n\n  relation = {}\n\n  constructor() { super() }\n\n}" },
    { module: 'middleware', name: "[NAME]Middleware.js", mount: false, dir: "middleware", content: "module.exports = function (request, response, next) {\n  /**\n  * write your code in here\n  */\n\n  next()\n}" }
  ]
}