import { Application, Express } from 'express'
import Router from '../router'

declare namespace Middleware {}

declare class Middleware {
  _express: Express
  _app: Application

  router(arg: typeof Router): Middleware
  listen(): Application
  static build(): Middleware
}

export = Middleware