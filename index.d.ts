import SquirrelResourceMiddleware from './typings/http/middleware/Middleware'
import SquirrelResourceRouter from './typings/http/router'
import SquirrelResourceStorage from './typings/util/Storage'
import SquirrelResourceBaseController from './typings/http/controller/base_controller'
import SquirrelResourceMake from './typings/util/Make'
import SquirrelResourceConfig from './typings/config'
import SquirrelResourceValidator from './typings/util/Validator'
import SquirrelResourceCrypto from './typings/crypto/index'
import SquirrelResourceSmtp from './typings/smtp/smtp'
import SquirrelResourceUtilities from './typings/util/Utilities'

export = {
  Storage: SquirrelResourceStorage,
  Router: SquirrelResourceRouter,
  BaseController: SquirrelResourceBaseController,
  Middleware: SquirrelResourceMiddleware,
  Make: SquirrelResourceMake,
  Config: SquirrelResourceConfig,
  Validator: SquirrelResourceValidator,
  Crypto: SquirrelResourceCrypto,
  Mailer: SquirrelResourceSmtp,
  Utilities: SquirrelResourceUtilities
}