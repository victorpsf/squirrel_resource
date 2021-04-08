const Path = require('./Path')

module.exports = class Storage extends Path {
  _fs = require('fs')

  constructor() { super() }

  /**
   * @param {*} path 
   * 
   * verifica se path existe
   * 
   * @returns 
   */
  path_exists(path) {
    return {
      path,
      status: this._fs.existsSync(path)
    }
  }

  /**
   * @param {*} path 
   * 
   * verifica path
   * 
   * @returns stat
   */
  stat(path) {
    return this._fs.statSync(path)
  }

  /**
   * @param {*} path 
   * 
   * verifica se é um diretorio
   * 
   * @returns 
   */
  is_dir(path) {
    let exists = this.path_exists(path)
    if (!exists.status) return exists

    let stat = this.stat(path)
    return {
      status: stat.isDirectory(),
      path
    }
  }

  /**
   * @param {*} path 
   * 
   * verifica se é um arquivo
   * 
   * @returns 
   */
  is_file(path) {
    let exists = this.path_exists(path)
    if (!exists.status) return exists

    let stat = this.stat(path)
    return {
      status: stat.isFile(),
      path
    }
  }

  /**
   * @param {*} path 
   * 
   * cria um diretorio
   */
  mkdir(path) {
    this._fs.mkdirSync(path)
  }

  /**
   * @param {*} path 
   * 
   * listagem de diretorio
   * 
   * @returns []
   */
  list_dir(path) {
    let exists = this.is_dir(path)
    if (!exists.status) throw new Error('Storage list_dir: path is not directory')

    return this._fs.readdirSync(path)
  }

  /**
   * @param {*} value 
   * @param {*} parser 
   * @param {*} encodingType 
   * 
   * conversão de valor
   * 
   * @returns 
   */
  static parseContent(...args) {
    let storage = new this
    return storage.parseContent.apply(storage, args)
  }

  /**
   * @param {*} value 
   * @param {*} parser 
   * @param {*} encodingType 
   * 
   * conversão de valor
   * 
   * @returns 
   */
  parseContent(value, parser, encodingType = 'write') {
    switch (parser) {
      case 'json':
      case 'array':
        return (encodingType == 'write') ? JSON.stringify(vaue) : JSON.parse(value)
      default:
        return value
    }
  }

  /**
   * @param {path,filename,value,encoding,parser} param0 
   * 
   * salvar arquivo
   */
  save_file({ path, filename, value, encoding, parser }) {
    let exists = this.is_dir(path), filePath = ''
    if (!exists.status) throw new Error('Storage save_file: Path is not directory')
    if (!filename)      throw new Error('Storage save_file: Filename not informed')
    if (!encoding)      encoding = 'utf-8'
    if (parser) value = this.parseContent(value, parser, 'write')
    filePath = this.join_path(path, filename)

    this._fs.writeFileSync(filePath, value, { encoding })
  }

  /**
   * @param {path,filename,encodin,parser} param0 
   * 
   * leitura de arquivo
   * 
   * @returns 
   */
  read_file({ path, filename, encoding, parser }) {
    let exists = this.is_dir(path), filePath = ''
    if (!exists.status) throw new Error('Storage read_file: Path is not directory')
    if (!filename)      throw new Error('Storage read_file: Filename not informed');
    if (!encoding)      encoding = 'utf-8'
    filePath = this.join_path(path, filename)

    let value = this._fs.readFileSync(filePath, { encoding })
    return (parser) ? this.parseContent(value, parser, 'read') : value
  }

  /**
   * @param  {...any} args 
   * 
   * importa arquivo
   * 
   * @returns 
   */
  static require(...args) {
    let storage = new this
    return storage.require.apply(storage, args)
  }

  /**
   * @param {*} path 
   * @param {*} use 
   * 
   * importa arquivo
   * 
   * @returns 
   */
  require(path, use = false) {
    if (use) path = this.join_path(this.get('root'), path)
    let exists = this.is_file(path)
    if (!exists.status) throw new Error(`Storage require: ${path} is not file`)

    return require(path)
  }

  static disk(...args) {
    let storage = new this
    return storage.disk.apply(storage, args)
  }

  disk(_path, type) {
    const constructor = function (storage = new Storage(), _path_) {
      return {
        is_dir: function (path) {
          return storage.is_dir(path)
        },
        is_file: function (path) {
          return storage.is_file(path)
        },
        exists: function (path) {
          return storage.path_exists(path)
        },
        save: function ({ filename, value, encoding, parser }) {

        },
        find: function ({ filename, encoding, parser }) {

        },
        list: function (path) {
          return storage.list_dir(path)
        }
      }
    }

    _path = this.join_path(this.get(type || 'root'), _path)
    return constructor.apply(this, _path);
  }

  /**
   * carrega diretorios da aplicação
   */
  static load(...args) {
    let storage = new this
    return storage.load.apply(storage, args)
  }

  /**
   * load
   */
  load() {
    for(let dir of this._directorys.dir) {
      let exists = this.is_dir(this.get(dir))

      if (exists.status) continue
      this.mkdir(exists.path)
    }

    for(let file of this._directorys.files) {
      let fullPath = this.get(file.dir)

      let exists = this.is_file(
        this.join_path(fullPath, file.name)
      )
      if (exists.status) continue

      this.save_file({ path: fullPath, filename: file.name, value: file.content })
    }
  }
}