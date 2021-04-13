import { Request } from 'express'
import Cache from '../cache'

export interface CustomRequest extends Request {
  cache: () => Cache;
  secret: () => string;
  passphrase: () => string;
  iv: () => string;
}