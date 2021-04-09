module.exports = class Path {
  _process    = require('process');
  _path       = require('path');
  _directorys = require('./directorys')
  _publicDirectorys = ['public']
  _paths     = {
    dir: '',
    path: '/',
    http: '/http',
    controller: '/controller',
    service: '/service',
    private: '/private',
    public: '/public',
    model: '/app',
    pages: '/pages',
    api: '/api',
    make: '/make',
    ssl: '/ssl'
  }

  constructor() {
    this.set()
  }

  /**
   * @param {*} path 
   * 
   * informação do path passado
   * 
   * @returns 
   */
  path_info(path) {
    return this._path.parse(path)
  }

  /**
   * @param {*} value 
   * @param {*} index 
   * @param {*} array 
   * 
   * obtem path raiz
   * 
   * @returns 
   */
  mapArgsExecPath(value, index, array) {
    let info = this.path_info(value)

    if (info.base == 'index.js') return info.dir;
    return '';
  }

  /**
   * @param {*} args
   * obtem informação do local de execução do primeiro arquivo
   * recomendação que esteja na base do projeto
   */
  exec_dir(args = []) {
    let path = args.map((...args) => this.mapArgsExecPath.apply(this, args)).join('');
    return path;
  }

  /**
   * adiciona path raiz
   */
  set() {
    this._paths.dir = this.exec_dir(this._process.argv)
  }

  /**
   * @param {*} path 
   * 
   * obtem caminhos definidos na biblioteca
   * 
   * @returns String
   */
  static get(path) {
    let model = new this
    return model.get(path)
  }

  /**
   * @param {*} path 
   * 
   * obtem caminhos definidos na biblioteca
   * 
   * @returns String
   */
  get(path = 'root') {
    let root  = this.join_path(this._paths.dir, this._paths.path)

    switch (path) {
      case 'controller':
      case 'service':
        return this.join_path(this.get('http'), this._paths[path])
      case 'http':
      case 'private':
      case 'public':
      case 'model':
      case 'api':
      case 'make':
        return this.join_path(root, this._paths[path])
      case 'pages':
        return this.join_path(this.get('model'), this._paths[path])
      case 'ssl':
        return this.join_path(this.get('private'), this._paths[path])
      case 'root':
      default:
        return root
    }
  }

  /**
   * @param  {...any} args 
   * 
   * junta as strings de path
   * 
   * @returns 
   */
  static join_path(...args) {
    let path = new this()
    return path.join_path.apply(path, args)
  }

  /**
   * @param  {...any} args 
   * 
   * junta as strings de path
   * 
   * @returns 
   */
  join_path(...args) {
    return this._path.join.apply(this, args)
  }
}