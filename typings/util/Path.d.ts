import Directorys from '../interfaces/directorys' 
import TypeDirectory from '../types/repository'
import { ParsedPath } from 'path'

declare namespace Path {}

declare class Path {
  _process: import('process')
  _path   : import('path')
  _directorys: Directorys
  _publicDirectorys: string[]
  _paths: { [key: string]: string }

  path_info(): ParsedPath
  mapArgsExecPath(value: string, index: number, array: string[]): string
  exec_dir(args: string[]): string
  set(): void
  static get(arg: TypeDirectory): string
  get(arg: TypeDirectory): string
  static join_path(args: string[]): string
  join_path(args: string[]): string
}

export = Path