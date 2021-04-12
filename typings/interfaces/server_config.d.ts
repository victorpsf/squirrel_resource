import ConfigListen from './config_listen'

declare interface ServerConfig {
  server: ConfigListen;
  middleware: { max_request: number, request_second: number };
  ssl?: { cert?: string, key?: string, pfx?: string, passphrase?: string };
  protocol: 'http'| 'https';
}

export = ServerConfig