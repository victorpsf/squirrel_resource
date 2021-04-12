import { Application, Express } from 'express'
import { Server } from 'http'
import Router from '../router'
import ConfigListen from '../../interfaces/config_listen'

declare namespace Middleware {}

declare class Middleware {
  _express: Express
  _app: Application

  router(arg: typeof Router): Middleware
  listen(arg: (config: ConfigListen) => void): Server
  static build(): Middleware
}

export = Middleware