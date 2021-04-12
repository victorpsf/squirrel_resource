import { Util } from 'squirrel_orm'

declare namespace Validator {
  interface rules {
    [key: string]: string
  }
}

declare class Validator extends Util {
  constructor(data: object, rules: object, message: string)

  fails(): boolean
  errorResult(): { code: number, message: string, result: { error: object } }
  getMessage(): string
  validateField(rule: string, value: any): boolean
  handle(): Validator
  static make(all: object, rules: Validator.rules, message: object): Validator
}

export = Validator