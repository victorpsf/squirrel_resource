declare namespace Utilities {
  interface RandString {
    super: boolean;
    numeric: boolean;
  }
}

declare class Utilities {
  superCharacter(): string
  numberCharacter(): string
  randomNumber(min: number, max: number): number
  randomString(len: number, use: Utilities.RandString): string
}

export = Utilities