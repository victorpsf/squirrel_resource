const { Router, static } = require('express')
const Storage = require('../util/Storage')
const { Util } = require('squirrel_orm')

const RouterApi = function () {
  return {
    _prefix_: null,
    _router_: Router(),
    _util_: new Util(),
    _storage_: new Storage(),
    _routers_: { MIDDLEWARE: [], GET: [], POST: [], PUT: [], DELETE: [], OPTIONS: [] },

    _unsetAll() {
      delete this._prefix_
      delete this._util_
      delete this._storage_
      delete this._routers_
    },

    _parseUrl(url) {
      if (!this._util_.isString(url)) throw new Error('squirrel_resource Router: url is not string')
      return (url.substr(0,1) !== '/')? `/${url}` : url
    },

    _usePrefix() {
      if (this._util_.isNullOrUndefined(this._prefix_)) return
      let { url, callback } = this._prefix_

      let router = callback(RouterApi())
      if (router && this._util_.isFunction(router.build)) this._router_.use(url, router.build())
    },

    _getController(httpMethod, controller) {
      // indica que foi passado um path
      if (/\/|\\/.test(controller)) {
        controller = this._storage_.join_path(this._storage_.get('root'), controller)
      } else {
        let use = 'controller'
        if (httpMethod == 'MIDDLEWARE') use = httpMethod.toLowerCase()
        controller = this._storage_.join_path(this._storage_.get(use), controller)
      }

      controller = this._storage_.require(controller)

      if (httpMethod == 'MIDDLEWARE') return controller
      let prototype = this._util_.getClassMethods(controller)

      if (!this._util_.in_array(prototype, 'instance')) throw new Error('squirrel_resource: instance method is not defined in controller')
      return controller
    },

    _storage_router(httpMethod, url, args = { controller, method, callback }) {
      this._routers_[httpMethod].push({
        url,
        args
      });
    },

    _set_middleware_callback(url, { callback }) {
      return function (request, response, next) {
        if (url == request.url) return callback(request, response, next)
        next()
      }
    },

    _set_router_storage_callback(url, httpMethod,  { callback }) {
      if (httpMethod == 'middleware') return this._router_.use(url, this._set_middleware_callback(url, { callback }));
      this._router_[httpMethod](url, callback)
    },

    _set_router_storage_controller(url, httpMethod, { controller, method }) {
      this._router_[httpMethod](url, this._addRouterCallback(controller, method))      
    },

    _set_router_storage() {
      for(let TYPE in this._routers_) {
        for(let index in this._routers_[TYPE]) {
          let ROUTER = this._routers_[TYPE][index]
          let {
            url,
            args: {
              controller,
              method, 
              callback
            }
          } = ROUTER

          if (callback) this._set_router_storage_callback(url, TYPE.toLowerCase(), { callback })
          else          this._set_router_storage_controller(url, TYPE.toLowerCase(), { controller, method })
        }
      }
    },

    _addRouterCallback(Controller, Method) {
      return function (request, response) {
        Controller.instance(request, response)[Method]()
      }
    },

    _addRouter(httpMethod, url, controller, method) {
      if (this._util_.isString(controller)) {
        let argument = {}
        controller = this._getController(httpMethod, controller)

        if (httpMethod == 'MIDDLEWARE') {
          argument.callback = controller
        } else {
          argument = { controller, method }
        }

        this._storage_router(httpMethod, url, argument)
      }
      else if (this._util_.isFunction(controller))
        this._storage_router(httpMethod, url, { callback: controller })
      else throw new Error('squirrel_resource Router: bad paramiter')
    },

    use(...args) {
      this._router_.use(...args)
      return this
    },

    responseHeaders(headers) {
      if (!this._util_.isObject(headers)) {}
      else {
        this.use(function (request, response, next) {
          for(let key in headers) 
            response.setHeader(key, headers[key])
          next()
        })
      }

      return this
    },

    static(url, { dir, path }) {
      let _url_ = this._parseUrl(url),
      _path = ''

      if (this._util_.isString(dir)) {
        if (!this._util_.in_array(this._storage_._publicDirectorys, dir)) throw new Error(`squirrel_resource Router: dir ${dir} is not public directory`)
        _path = this._storage_.get(dir)
      }

      if (this._util_.isString(path)) {
        _path = (_path) ? this._storage_.join_path(_path, path) : path
      }

      if (!_path) throw new Error('squirrel_resource Router: static function require object in second argument')

      this.use(_url_, static(_path))
      return this
    },

    prefix(prefix, callback) {
      if (!this._util_.isFunction(callback)) throw new Error('squirrel_resource Router: second argument is not function, please inform callback')

      this._prefix_ = {
        url: this._parseUrl(prefix),
        callback
      }
      return this
    },

    get(url, controller, method) {
      url = this._parseUrl(url)
      this._addRouter('GET', url, controller, method)
      return this
    },

    post(url, controller, method) {
      url = this._parseUrl(url)
      this._addRouter('POST', url, controller, method)
      return this
    },

    put(url, controller, method) {
      url = this._parseUrl(url)
      this._addRouter('PUT', url, controller, method)
      return this
    },

    delete(url, controller, method) {
      url = this._parseUrl(url)
      this._addRouter('DELETE', url, controller, method)
      return this
    },
    options(url, controller, method) {
      url = this._parseUrl(url)
      this._addRouter('OPTIONS', url, controller, method)
      return this
    },

    middleware(url, controller) {
      url = this._parseUrl(url)
      this._addRouter('MIDDLEWARE', url, controller)
      return this
    },

    build() {
      this._set_router_storage()
      this._usePrefix()
      this._unsetAll()
      return this._router_
    }
  }
}

module.exports = RouterApi