import BaseSaveFile from './base_save_file'

declare interface SaveFile extends BaseSaveFile {
  path: string;
}

export = SaveFile