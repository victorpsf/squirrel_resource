import { Transporter, SentMessageInfo } from 'nodemailer'
import Storage from '../util/Storage'
import MailConfig from '../interfaces/mail_config'

declare namespace Smtp {
  interface mail {
    from: string,
    to: string[],
    subject?: string,
    text?: string,
    html?: string,
  }
}

declare class Smtp {
  _transport: Transporter
  _storage: Storage
  _mail?: Smtp.mail
  _config: MailConfig

  setEmitter(): Smtp
  setReceiver(arg: string): Smtp
  setReceiver(arg: string[]): Smtp
  setSubject(arg: string): Smtp
  setText(arg: string): Smtp
  setHtml(filename: string, replaces: [[RegExp, any]]): Smtp
  getMail(): Smtp.mail
  send(): Promise<SentMessageInfo>
}

export = Smtp