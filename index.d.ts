import SquirrelResourceMiddleware from './typings/http/middleware/Middleware'
import SquirrelResourceRouter from './typings/http/router'
import SquirrelResourceStorage from './typings/util/Storage'
import SquirrelResourceBaseController from './typings/http/controller/base_controller'
import SquirrelResourceMake from './typings/util/Make'

export = {
  Storage: SquirrelResourceStorage,
  Router: SquirrelResourceRouter,
  BaseController: SquirrelResourceBaseController,
  Middleware: SquirrelResourceMiddleware,
  Make: SquirrelResourceMake
}