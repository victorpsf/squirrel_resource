import { Request, Response } from 'express'
import DefaultReponseJSON from '../../interfaces/default_response_json'
import DefaultReponseJSONResult from '../../interfaces/default_response_json_result'
import Validator from '../../util/Validator'

declare namespace BaseController {}

declare class BaseController {
  Validator: Validator
  request: Request
  response: Response

  constructor(request: Request, response: Response)

  currentTime(): number
  status(code: number): void
  end(): void
  query(): object
  body(): object
  params(): object
  all(): object

  defaultResponseJSON(args: DefaultReponseJSON): DefaultReponseJSONResult
  static instance(request: Request, response: Response): BaseController
}

export = BaseController