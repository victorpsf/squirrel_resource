import request from '../../interfaces/request'
import response from '../../interfaces/response'
import DefaultReponseJSON from '../../interfaces/default_response_json'
import DefaultReponseJSONResult from '../../interfaces/default_response_json_result'
import Validator from '../../util/Validator'
import Crypto from '../../crypto/index'
import Cache from '../../cache'

declare namespace BaseController {}

declare class BaseController {
  Validator: typeof Validator
  request: request
  response: response
  Crypto: typeof Crypto
  Cache: Cache

  constructor(request: request, response: response)

  currentTime(): number
  status(code: number): void
  end(): void
  query(): object
  body(): object
  params(): object
  all(): object

  defaultResponseJSON(args: DefaultReponseJSON): DefaultReponseJSONResult
  static instance(request: request, response: response): BaseController
}

export = BaseController