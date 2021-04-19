const nodemailer = require('nodemailer')
const Config = require('../config')
const Storage = require('../util/Storage')

module.exports = class Smtp {
  _storage = new Storage()
  _config = {}
  _mail = {}

  constructor() {
    this._config = Config.mail()
    this.setTransport()
    this.setEmitter()
  }

  setTransport() {
    this._transport = nodemailer.createTransport(this._config)
  }

  setEmitter() {
    this._mail.from = this._config.auth.user
    return this
  }

  setReceiver(value) {
    this._mail.to = value
    return this
  }

  setSubject(value) {
    this._mail.subject = value
    return this
  }

  setText(value) {
    this._mail.text = value
    return this
  }

  setHtml(value, replaces) {
    let path = this._storage.get('mail')
    this._mail.html = this._storage.read_file({
      path: path,
      filename: value,
      encoding: 'utf-8'
    })

    if (replaces && replaces instanceof Array && Array.isArray(replaces)) for(let replace of replaces) {
      if (replace instanceof Array && Array.isArray(replace)) {
        let [regexp, value] = replace
        this._mail.html = this._mail.html.replace(regexp, value)
      } else continue
    }
    return this
  }

  getMail() {
    let mail = Object.assign({}, this._mail)
    this._mail = {}
    this.setEmitter()
    return mail
  }

  send() {
    let mail = this.getMail()
    return new Promise((resolve, reject) => {
      this._transport.sendMail(mail, function (err, info) {
        if (err) return reject(err)
        return resolve(info)
      })
    })
  }
}