import { Router, Request, Response, NextFunction } from 'express'
import { Util } from 'squirrel_orm'
import TypeDirectory from '../types/repository'
import Storage from '../util/Storage'
import httpMethod from '../types/http_method'
import BaseController from '../http/controller/base_controller'

declare interface RouterApi {
  _prefix_?: { url: string, callback: () => any }
  _router_: typeof Router
  _util_: typeof Util
  _storage_: Storage

  _parseUrl(url: string): string
  _usePrefix(): void
  _getController(controller: string): any
  _addRouterCallback(controller: BaseController, Method: string): (req: Request, res: Response) => void
  _addRouter(httpMethod: httpMethod, url: string, controller: string, method: string): void
  _addRouter(httpMethod: httpMethod, url: string, controller: (req: Request, res: Response) => void): void
  use(args: any[]): RouterApi
  responseHeader(headers?: object): RouterApi
  static(url: string, args: { dir?: TypeDirectory | string, path: string }): RouterApi
  prefix(prefix: string, callback: (routerApi: RouterApi) => RouterApi): RouterApi
  get(url: string, controller: string, method: string): RouterApi
  get(url: string, controller: (req: Request, res: Response) => void): RouterApi
  put(url: string, controller: string, method: string): RouterApi
  put(url: string, controller: (req: Request, res: Response) => void): RouterApi
  post(url: string, controller: string, method: string): RouterApi
  post(url: string, controller: (req: Request, res: Response) => void): RouterApi
  delete(url: string, controller: string, method: string): RouterApi
  delete(url: string, controller: (req: Request, res: Response) => void): RouterApi
  options(url: string, controller: string, method: string): RouterApi
  options(url: string, controller: (req: Request, res: Response) => void): RouterApi
  build(): Router
  middleware(url: string, arg: (req: Request, res: Response, n: NextFunction) => void): RouterApi
  middleware(url: string, arg: string): RouterApi
}

declare function routerApi(): RouterApi

declare namespace routerApi {}

export = routerApi