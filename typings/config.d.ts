
import MysqlConfig from './interfaces/mysql_config'
import ServerConfig from './interfaces/server_config'

declare namespace Config {}

declare class Config {
  static mysql(): MysqlConfig
  mysql(): MysqlConfig
  static server(): ServerConfig
  server(): ServerConfig
}

export = Config