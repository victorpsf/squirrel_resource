import Parser from '../types/parser'
import EncodingFile from '../types/encoding_save'

declare interface BaseReadFile {
  filename: string;
  // default utf-8
  encoding?: EncodingFile;
  parser?: Parser;
}

export = BaseReadFile