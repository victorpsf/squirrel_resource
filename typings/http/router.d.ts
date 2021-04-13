
import { Router, Request, Response, NextFunction } from 'express'
import CustomRequest from '../interfaces/request'
import CustomResponse from '../interfaces/response'
import { Util } from 'squirrel_orm'
import TypeDirectory from '../types/repository'
import Storage from '../util/Storage'
import httpMethod from '../types/http_method'
import BaseController from '../http/controller/base_controller'

declare namespace RouterApi {
  interface request extends Request, CustomRequest {}
  interface response extends Response, CustomResponse {}
}

declare interface RouterApi {
  _prefix_?: { url: string, callback: () => any }
  _router_: typeof Router
  _util_: typeof Util
  _storage_: Storage

  _parseUrl(url: string): string
  _usePrefix(): void
  _getController(controller: string): any
  _addRouterCallback(controller: BaseController, Method: string): (req: RouterApi.request, res: RouterApi.response) => void
  _addRouter(httpMethod: httpMethod, url: string, controller: string, method: string): void
  _addRouter(httpMethod: httpMethod, url: string, controller: (req: RouterApi.request, res: RouterApi.response) => void): void
  use(args: any[]): RouterApi
  responseHeaders(headers?: object): RouterApi
  static(url: string, args: { dir?: TypeDirectory | string, path: string }): RouterApi
  prefix(prefix: string, callback: (routerApi: RouterApi) => RouterApi): RouterApi
  get(url: string, controller: string, method: string): RouterApi
  get(url: string, controller: (req: RouterApi.request, res: RouterApi.response) => void): RouterApi
  put(url: string, controller: string, method: string): RouterApi
  put(url: string, controller: (req: RouterApi.request, res: RouterApi.response) => void): RouterApi
  post(url: string, controller: string, method: string): RouterApi
  post(url: string, controller: (req: RouterApi.request, res: RouterApi.response) => void): RouterApi
  delete(url: string, controller: string, method: string): RouterApi
  delete(url: string, controller: (req: RouterApi.request, res: RouterApi.response) => void): RouterApi
  options(url: string, controller: string, method: string): RouterApi
  options(url: string, controller: (req: RouterApi.request, res: RouterApi.response) => void): RouterApi
  build(): Router
  middleware(url: string, arg: (req: RouterApi.request, res: RouterApi.request, n: NextFunction) => void): RouterApi
  middleware(url: string, arg: string): RouterApi
}

declare function routerApi(): RouterApi

export = routerApi