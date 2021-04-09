import { Application, Express } from 'express'

declare namespace Middleware {}

declare class Middleware {
  _express: Express
  _app: Application

  router(): void
  get(): Middleware
  listen(): Application
  static build(): Middleware
}

export = Middleware