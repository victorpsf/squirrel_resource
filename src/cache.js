const { Util } = require('squirrel_orm')

module.exports = class Cache extends Util {
  time = 3600
  interval = null
  check = {}
  cache = {}

  constructor(args = {}) {
    super()
    let { cache_clear_time = 3600 } = args || {}
    this.time = cache_clear_time;
    this.listen()
  }

  set(key, value) {
    if (!this.isString(key))   throw new Error("Squirrel_resource cache set: key is not string")
    if (!this.isObject(value)) throw new Error("Squirrel_resource cache set: value is not object")

    this.cache[key] = Object.assign(this.get(key), value)
    this.check[key] = new Date()
    return this.cache[key]
  }

  unset(key) {
    this.cache[key] = null
    this.check[key] = null
    delete this.cache[key]
    delete this.check[key]
  }

  get(key) {
    this.check[key] = new Date()
    return this.cache[key] || {}
  }

  listen() {
    let time = parseInt(this.time)

    if (time !== NaN && !this.isNumber(time)) throw new Error("Squirrel_resource: time in cache is not number")
    this.interval = setInterval(() => {
      for(let key in this.check) {
        let dateString = this.check[key].toJSON()
        let lastModified = new Date(dateString)
        let currentTime  = new Date()

        lastModified.setSeconds(lastModified.getSeconds() + time)

        if (lastModified <= currentTime) this.unset(key)
      }
    }, 10000)
  }
}