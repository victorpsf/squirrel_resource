declare interface ConfigListen {
  protocol: 'http'| 'https';
  host: string;
  port: number;
}

export = ConfigListen