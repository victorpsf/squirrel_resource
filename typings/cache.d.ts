import { Util } from 'squirrel_orm'

declare namespace Cache {
  interface CacheOptions {
    cache_clear_time: number;
  }
}

declare class Cache extends Util {
  constructor(args: Cache.CacheOptions)

  set(key: string, value: object): object
  unset(key: string): void
  get(key: string): object
}

export = Cache