import { Request, Response } from 'express'
import CustomRequest from '../../interfaces/request'
import CustomResponse from '../../interfaces/response'
import DefaultReponseJSON from '../../interfaces/default_response_json'
import DefaultReponseJSONResult from '../../interfaces/default_response_json_result'
import Validator from '../../util/Validator'
import Crypto from '../../crypto/index'
import Cache from '../../cache'

declare namespace BaseController {
  interface request extends Request, CustomRequest {}
  interface response extends Response, CustomResponse {}
}

declare class BaseController {
  Validator: typeof Validator
  request: BaseController.request
  response: BaseController.response
  Crypto: typeof Crypto
  Cache: Cache

  constructor(request: BaseController.request, response: BaseController.response)

  currentTime(): number
  status(code: number): void
  end(): void
  query(): object
  body(): object
  params(): object
  all(): object
  sleep(time: number): Promise<boolean>

  defaultResponseJSON(args: DefaultReponseJSON): DefaultReponseJSONResult
  static instance(request: BaseController.request, response: BaseController.response): BaseController
}

export = BaseController