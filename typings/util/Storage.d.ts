import Path from './Path'
import Verify from '../interfaces/verify'
import Parser from '../types/parser'
import Encoding from '../types/encoding'
import Repository from '../types/repository'
import SaveFile from '../interfaces/save_file'
import ReadFile from '../interfaces/read_file'
import Disk from '../interfaces/disk'
import { Stats } from 'fs'

declare namespace Storage {}

declare class Storage extends Path {
  _fs: import('fs')

  path_exists(path: string): Verify
  stat(path: string): Stats
  id_dir(path: string): Verify
  is_file(path: string): Verify
  mkdir(path): void
  list_dir(path: string): string[]
  static parseContent(value: any, parser: Parser, encodingType: Encoding): any
  parseContent(value: any, parser: Parser, encodingType: Encoding): any
  save_file(arg: SaveFile): void
  read_file(arg: ReadFile): any
  static require(path: string, useRoot: boolean): any
  require(path: string, useRoot: boolean): any
  static disk(path: string, type: Repository): Disk
  disk(path: string, type: Repository): Disk
  static load(args: any[]): void
  load(args: any[]): void
}

export = Storage