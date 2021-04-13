import ciphers from '../types/asymmetric_cipher'
import hashCiphers from '../types/hash_cipher'
import Encoding from '../types/encoding_save'
import { KeyPairSyncResult } from 'crypto'

declare namespace Asymmetric {
  interface AsymmetricOptions {
    // default aes-256-cbc
    algorithm?: ciphers,
    passphrase: string,
    // default false
    hash?: boolean,
    // default sha512
    hashAlgorithm?: hashCiphers
    // default 1024
    keyLength?: '8192' | '4096' | '2048' | '1024',
    publicKey?: string,
    privateKey?: string
  }
}

declare class Asymmetric {
  constructor(args: Asymmetric.AsymmetricOptions)

  getKeysPair(): KeyPairSyncResult<string, string>
  // format default 'hex'
  publicEncrypt(value: string, format: Encoding): string
  // format default 'hex'
  privateDecrypt(value: string, format: Encoding): string
}

export = Asymmetric