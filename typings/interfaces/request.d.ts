import Cache from '../cache'

declare interface CustomRequest {
  cache(): Cache;
  secret(): string;
  passphrase(): string;
  iv(): string;
}

export = CustomRequest