import { Application, Express } from 'express'

declare namespace Middleware {}

declare class Middleware {
  _express: Express
  _app: Application

  router(): void
  get(): Middleware
  listen(): Application
  build(): Middleware
}

export = Middleware