const { Router, static } = require('express')
const Storage = require('../util/Storage')
const { Util } = require('squirrel_orm')

const RouterApi = function () {
  return {
    _prefix_: null,
    _router_: Router(),
    _util_: new Util(),
    _storage_: new Storage(),

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
    _getController(controller) {
      // indica que foi passado um path
      if (/\/|\\/.test(controller)) {
        controller = this._storage_.join_path(this._storage_.get('root'), controller)
      } else {
        controller = this._storage_.join_path(this._storage_.get('controller'), controller)
      }

      controller = this._storage_.require(controller)
      let prototype = this._util_.getClassMethods(controller)

      if (!this._util_.in_array(prototype, 'instance')) throw new Error('squirrel_resource: instance method is not defined in controller')
      return controller
    },
    _addRouterCallback(Controller, Method) {
      return function (request, response) {
        Controller.instance(request, response)[Method]()
      }
    },
    _addRouter(httpMethod, url, controller, method) {
      if (this._util_.isString(controller)) {
        controller = this._getController(controller)
        this._router_[httpMethod](url, this._addRouterCallback(controller, method))
      } else if (this._util_.isFunction(controller))
        this._router_[httpMethod](url, controller)
      else throw new Error('squirrel_resource Router: bad paramiter')
    },

    use(...args) {
      this._router_.use.apply(null, args)
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
        if (this._util_.in_array(this._storage_._publicDirectorys, dir)) throw new Error(`squirrel_resource Router: dir ${dir} is not public directory`)
        _path = this._storage_.get(dir)
      }

      if (this._util_.isString(path)) {
        _path = (_path) ? this._storage_.join_path(_path, path) : path
      }

      if (_path) throw new Error('squirrel_resource Router: static function require object in second argument')

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

      this._addRouter('get', url, controller, method)

      return this
    },
    post(url, controller, method) {
      url = this._parseUrl(url)

      this._addRouter('post', url, controller, method)

      return this
    },
    put(url, controller, method) {
      url = this._parseUrl(url)

      this._addRouter('put', url, controller, method)

      return this
    },
    delete(url, controller, method) {
      url = this._parseUrl(url)

      this._addRouter('delete', url, controller, method)

      return this
    },
    options(url, controller, method) {
      url = this._parseUrl(url)

      this._addRouter('options', url, controller, method)

      return this
    },

    build() {
      this._usePrefix()
      return this._router_
    }
  }
}

module.exports = RouterApi