import BaseReadFile from './base_read_file'

declare interface ReadFile extends BaseReadFile {
  path: string;
}

export = ReadFile