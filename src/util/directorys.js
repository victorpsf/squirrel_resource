module.exports = {
  "dir": ["http", "controller", "service", "private", "public", "model", "pages", "api", "make", "ssl"],
  "files": [
    { name: ".env-example", dir: "root", content: "HTTP_PROTOCOL=http\nHTTP_HOST=127.0.0.1\nHTTP_PORT=3000\n\nHTTP_CERT=\nHTTP_KEY=\nHTTP_PFX=\nHTTP_PASSPHRASE=\n\n\nMYSQL_HOST=localhost\nMYSQL_PORT=3306\nMYSQL_USER=root\nMYSQL_PASSWORD=\nMYSQL_DATABASE=\nMYSQL_TIMEOUT=18000\n\nMYSQL_CERT=\nMYSQL_KEY=\nMYSQL_CA=\nMYSQL_PFX=\nMYSQL_PASSPHRASE=\nMYSQ_CRL=\nMYSQL_CIPHERS=" },
    { name: "BaseModel.js", dir: "model", content: "const { Model } = require('squirrel_orm')\nconst { Config } = require('squirrel_resource')\n\nmodule.exports = class BaseModel extends Model {\n  constructor() {\n    super(Config.mysql())\n  }\n}" },
  ]
}