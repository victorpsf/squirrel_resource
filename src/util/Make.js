const Storage = require('./Storage')
const Crypto = require('../crypto')

module.exports = class Make extends Storage {
  constructor() { super() }

  mapCommand(value, index, array) {
    return value.split('=')
  }
  
  mapCommandArray(value, index, array) {
    let [command, name] = value

    return { command: command.trim().toLowerCase(), name: (name) ? name.trim().toLowerCase(): name }
  }

  getEnvMap(shared, secret, passphrase, iv) {
    return function (value, index, array) {
      let [env] = value.split('=')

      if (/SERVER_SECRET\=/g.test(value) && secret)
        return value = `${env}=${shared}`
      else if (/SERVER_PASSPHRASE\=/g.test(value) && passphrase)
        return value = `${env}=${shared}`
      else if (/SERVER_IV\=/g.test(value) && iv) {
        const crypto = require('crypto')
        return value = `${env}=${crypto.randomBytes(16).toString('hex').toUpperCase()}`
      }
      else return value
    }
  }

  mapIv(line, index, array) {
    let [env] = line.split('=')
    if (/SERVER_IV\=/g.test(line)) {
      const crypto = require('crypto')
      let iv = crypto.randomBytes(16).toString('hex').toUpperCase()
      return line = `${env}=${iv}`
    }
    return line
  }

  getFiles(path, fileNames = [], count = 0) {
    try {
      return this.read_file({ path, filename: fileNames[count], encoding: 'utf-8' })
    } catch (error) {
      if (fileNames[count + 1])
        return this.getFiles(path, fileNames, count + 1)
      else throw error
    }
  }

  filterCommandArray(value, index, array) {
    let [command, name] = value
    let bool = false

    if (!command) return bool
    command = command.trim().toLowerCase()
    if (
      /\-\-[service]/.test(command) || 
      /\-\-[model]/.test(command) ||
      /\-\-[controller]/.test(command) ||
      /\-\-[router]/.test(command) || 
      /\-\-[middleware]/.test(command) ||
      /\-\-[env]\-[secret]/.test(command) ||
      /\-\-[env]\-[passphrase]/.test(command) || 
      /\-\-[hash]/.test(command) ||
      /\-\-[iv]/.test(command)
    ) bool = true

    return bool
  }

  read_commands(args = []) {
    this.commands = args.map(this.mapCommand).filter((...arg) => this.filterCommandArray.apply(this, arg)).map(this.mapCommandArray)
  }

  search_command(value) {
    let _index = -1, command = null
    
    for(let index in this.commands) {
      let data = this.commands[index];
      if (data.command == value) {
        _index = index;
        break;
      }
    }

    if (_index >= 0) {
      command = this.commands[_index]
      this.commands.splice(_index, 1)
    }
 
    return command
  }

  search_directory(_module, name) {
    for(let file of this._directorys.files) {
      if (file.module && file.module == _module) {
        file.dir = this.get(file.dir)
        file.name = file.name.replace(/\[NAME\]/g, name)
        return file
      }
    }
  }

  getName(value) {
    let name = value.substr(0, 1).toUpperCase()
    return (name += value.substr(1))
  }

  writeService(value, controller) {
    if (typeof value !== 'string') 
      throw new Error('--service value is not defined. \n\nexample:\n  --service=[NAME]\n  --service=[NAME] --controller')
    let name = this.getName(value),
        _service = this.search_directory('service', name)

    this.save_file({ 
      path: _service.dir, 
      filename: _service.name, 
      value: _service.content.replace(/\[NAME\]/g, name), 
      encoding: 'utf-8' 
    })

    if (controller) this.writeController(value)
  }

  writeController(value, service) {
    if (typeof value !== 'string') 
      throw new Error('--controller value is not defined. \n\nexample:\n  --controller=[NAME]\n  --controller=[NAME] --service')
    let name = this.getName(value), 
        directory = this.search_directory('controller', name)

    if (service) this.writeService(value)
    this.save_file({ 
      path: directory.dir, 
      filename: directory.name, 
      value: ((service)? directory.content.extended: directory.content.original).replace(/\[NAME\]/g, name), 
      encoding: 'utf-8' 
    })
  }

  writeRouter(value, controller, service) {
    if (typeof value !== 'string') 
      throw new Error('--router value is not defined. \n\nexample:\n  --router=[NAME]\n  --router=[NAME] --controller --service')
    let name = this.getName(value), 
        directory = this.search_directory('router', name)
    if (controller) this.writeController(value, service)

    this.save_file({ 
      path: directory.dir, 
      filename: directory.name, 
      value: ((controller || service) ? directory.content.original : directory.content.extended)
        .replace(/\[NAMECONTROLLER\]/g, controller ? `// Controller created: ${name}Controller.js`: '')
        .replace(/\[NAMESERVICE\]/g, service ? `// Service created: ${name}Service.js`: ''), 
      encoding: 'utf-8' 
    })
  }

  writeModel(value) {
    if (typeof value !== 'string') 
      throw new Error('--model value is not defined. \n\nexample:\n  --model=[NAME]')
    let name = this.getName(value), 
        directory = this.search_directory('model', name)

    this.save_file({ 
      path: directory.dir, 
      filename: directory.name, 
      value: directory.content.replace(/\[NAME\]/g, name), 
      encoding: 'utf-8' 
    })
  }

  writeMiddleware(value) {
    if (typeof value !== 'string') 
      throw new Error('--middleware value is not defined. \n\nexample:\n  --middleware=[NAME]')
    let name = this.getName(value), 
        directory = this.search_directory('middleware', name)

    this.save_file({ 
      path: directory.dir, 
      filename: directory.name, 
      value: directory.content.replace(/\[NAME\]/g, name), 
      encoding: 'utf-8' 
    })
  }

  writeSecretOrPassphraseOrIv(value, hash, secret, passphrase, iv) {
    if (typeof value !== 'string') 
      throw new Error('--set value is not defined. \n\nexample:\n  --set=[VALUE]')

    let rootPath = this.get('root'),
        content = this.getFiles(rootPath, ['.env', '.env-example'])

    if (!content) throw new Error('Make: .env and .env-example is not defined')
    if (hash) value = Crypto.Hash().update(value)

    this.save_file({ 
      path: rootPath, 
      filename: '.env', 
      value: content.split(/\n/).map(this.getEnvMap(value, secret, passphrase, iv)).join('\n')
    });
  }

  writeIv() {
    let rootPath = this.get('root'),
        content = this.getFiles(rootPath, ['.env', '.env-example'])

    this.save_file({ 
      path: rootPath, 
      filename: '.env', 
      value: content.split(/\n/).map(this.mapIv).join('\n')
    });
  }

  execute_command() {
    for(let data of this.commands) {
      let _command = null
      if (!data || !data.command) continue
      switch (data.command) {
        case '--controller':
          _command = this.search_command('--service')
          this.writeController(data.name, (_command && _command.command)? _command.command : null)
          break;
        case '--service':
          _command = this.search_command('--controller')
          this.writeService(data.name, (_command && _command.command)? _command.command : null)
          break;
        case '--router':
          this.writeRouter(data.name, this.search_command('--controller'), this.search_command('--service'))
          break;
        case '--model':
          this.writeModel(data.name)
          break;
        case '--middleware':
          this.writeMiddleware(data.name)
          break;
        case '--set':
          this.writeSecretOrPassphraseOrIv(data.name, this.search_command('--hash'), this.search_command('--env-secret'), this.search_command('--env-passphrase'), this.search_command('--iv'))
          break;
        case '--iv':
          this.writeIv()
          break;
        case '--help':
          console.log(`list commands in make
--set=[VALUE]                         set new value in .env
  --env-secret                        set 'SERVER_SECRET' in .env
  --env-passphrase                    set 'SERVER_PASSPHRASE' in .env
  --iv                                set 'SERVER_IV' random byte hexadecimal in .env
  --hash                              using hash 'sha512' in set value

--iv                                  set 'SERVER_IV' random byte hexadecimal in .env

--middleware=[NAME]                   set new middleware in http/middleware

--model=[NAME]                        set new model in app/

--router=[NAME]                       set new router in api/
  --controller                        set new controller using router name
  --service                           set new service using router name

--service=[NAME]                      set new service in http/service
  --controller                        set new controller using service name

--controller=[NAME]                   set new controller in http/controller
  --service                           set new service using controller name
`)
          break;
        default:
          console.log(`Unsupported command: '${data.command}'\n\nUsing 'node make --help'`)
          break;
      }
    }
  }

  async load() {
    this.read_commands(this._args)
    this.execute_command()
  }

  static build() {
    let make = new this
    return make.load()
  }
}