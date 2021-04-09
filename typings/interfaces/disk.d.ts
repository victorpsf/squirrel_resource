import Verify from './verify'
import BaseSaveFile from '../interfaces/base_save_file'
import BaseReadFile from '../interfaces/base_read_file'

declare namespace Disk {}

declare class Disk {
  is_dir(path: string): Verify
  is_file(path: string): Verify
  exists(path: string): Verify
  save(arg: BaseSaveFile): void
  find(arg: BaseReadFile): any
  list(path: string): string[]
}

export = Disk