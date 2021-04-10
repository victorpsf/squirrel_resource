
declare namespace Make {}

declare class Make {
  static build(): Promise<void>
}

export = Make