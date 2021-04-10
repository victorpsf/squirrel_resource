const Storage = require('./Storage')

module.exports = class Make extends Storage {
  constructor() { super() }

  mapCommand(value, index, array) {
    return value.split('=')
  }
  
  mapCommandArray(value, index, array) {
    let [command, name] = value

    return { command: command.trim().toLowerCase(), name: (name) ? name.trim().toLowerCase(): name }
  }

  filterCommandArray(value, index, array) {
    let [command, name] = value
    let bool = false

    if (!command) return bool
    if (
      /\-\-[service]/.test(command.trim().toLowerCase()) || 
      /\-\-[model]/.test(command.trim().toLowerCase()) ||
      /\-\-[controller]/.test(command.trim().toLowerCase()) ||
      /\-\-[router]/.test(command.trim().toLowerCase()) || 
      /\-\-[middleware]/.test(command.trim().toLowerCase())
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

  search_directory(name) {
    for(let file of this._directorys.files) {
      if (file.module && file.module == name) return file
    }
  }

  getName(value) {
    let name = value.substr(0, 1).toUpperCase()
    return (name += value.substr(1))
  }

  writeService(value, controller) {
    if (typeof value !== 'string') throw new Error('--service value is not defined. \n\nexample:\n  --service=[NAME]\n  --service=[NAME] --controller')
    let name = this.getName(value);
    let _service = this.search_directory('service')
    
    _service.dir = this.get(_service.dir)
    _service.name  = _service.name.replace(/\[NAME\]/g, name)
    _service.content   = _service.content.replace(/\[NAME\]/g, name)

    this.save_file({ path: _service.dir, filename: _service.name, value: _service.content, encoding: 'utf-8' })
    if (controller) this.writeController(value)
  }

  writeController(value, service) {
    if (typeof value !== 'string') throw new Error('--controller value is not defined. \n\nexample:\n  --controller=[NAME]\n  --controller=[NAME] --service')
    let name = this.getName(value), directory = this.search_directory('controller')

    if (service) this.writeService(value)
    directory.dir = this.get(directory.dir)
    directory.name = directory.name.replace(/\[NAME\]/g, name)
    directory.content = ((service)? directory.content.extended: directory.content.original).replace(/\[NAME\]/g, name)

    this.save_file({ path: directory.dir, filename: directory.name, value: directory.content, encoding: 'utf-8' })
  }

  writeRouter(value, controller, service) {
    if (typeof value !== 'string') throw new Error('--router value is not defined. \n\nexample:\n  --router=[NAME]\n  --router=[NAME] --controller --service')
    let name = this.getName(value), directory = this.search_directory('router')

    if (controller) this.writeController(value, service)
    directory.dir = this.get(directory.dir)
    directory.name = directory.name.replace(/\[NAME\]/g, name) 
    directory.content = (controller || service) ? directory.content.original : directory.content.extended

    directory.content = directory.content
      .replace(/\[NAMECONTROLLER\]/g, controller ? `// Controller created: ${name}Controller.js`: '')
      .replace(/\[NAMESERVICE\]/g, service ? `// Service created: ${name}Service.js`: '')

    this.save_file({ path: directory.dir, filename: directory.name, value: directory.content, encoding: 'utf-8' })
  }

  writeModel(value) {
    if (typeof value !== 'string') throw new Error('--model value is not defined. \n\nexample:\n  --model=[NAME]')
    let name = this.getName(value), directory = this.search_directory('model')

    directory.dir = this.get(directory.dir)
    directory.name = directory.name.replace(/\[NAME\]/g, name)
    directory.content = directory.content.replace(/\[NAME\]/g, name)

    this.save_file({ path: directory.dir, filename: directory.name, value: directory.content, encoding: 'utf-8' })
  }

  writeMiddleware(value) {
    if (typeof value !== 'string') throw new Error('--middleware value is not defined. \n\nexample:\n  --middleware=[NAME]')
    let name = this.getName(value), directory = this.search_directory('middleware')

    directory.dir = this.get(directory.dir)
    directory.name = directory.name.replace(/\[NAME\]/g, name)
    directory.content = directory.content.replace(/\[NAME\]/g, name)

    this.save_file({ path: directory.dir, filename: directory.name, value: directory.content, encoding: 'utf-8' })
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
        default:
          console.log(`Unsupported command: '${data.command}'`)
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