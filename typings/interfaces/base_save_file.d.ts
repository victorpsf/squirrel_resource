import Parser from '../types/parser'
import EncodingFile from '../types/encoding_save'

declare interface BaseSaveFile {
  filename: string;
  value: any;
  // default utf-8
  encoding?: EncodingFile;
  parser?: Parser;
}

export = BaseSaveFile