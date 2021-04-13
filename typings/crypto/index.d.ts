import Encoding from '../types/encoding_save'
import Hash from './hash'
import Symmetric from './symmetric'
import Asymmetric from './asymmetric'

declare namespace Crypto {}

declare class Crypto {
  static Hash(args: Hash.HashOptions): Hash
  static Asymmetric(args: Asymmetric.AsymmetricOptions): Asymmetric
  static Symmetric(args: Symmetric.SymmetricOptions): Symmetric
}

export = Crypto