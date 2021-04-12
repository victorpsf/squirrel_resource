const { Util } = require('squirrel_orm')

module.exports = class Validator extends Util {
  failed = false;
  failedFields = {};

  constructor(data, rules, message) {
    super();

    this.data = data;
    this.rules = rules;
    this.message = message;
  }

  fails() {
    return this.failed;
  }

  errorResult() {
    return {
      code: 400,
      message: 'bad request',
      result: {
        error: this.failedFields
      }
    };
  }

  getMessage(field, rule) {
    let rulemessage;
    if (this.isObject(this.message) && this.isObject(this.message[field]))
      rulemessage = this.message[field];
    let message = '';

    switch (rule) {
      case 'required':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is required`; break;
      case 'array':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not array`; break;
      case 'object':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not object`; break;
      case 'interger':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not interger`; break;
      case 'string':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not string`; break;
      case 'datetime':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not datetime`; break;
      case 'date':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not date`; break;
      case 'time':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not time`; break;
      case 'email':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not email`; break;
      case 'boolean':
        message = this.isString(rulemessage[rule]) ? rulemessage[rule] : `field '${field}' is not boolean`; break;
    }

    if (/min\:/g.test(rule) || /max\:/g.test(rule)) message = `field '${field}' error ${rule}`;

    return message;
  }

  validateField(rule, value) {
    switch (rule) {
      case 'required':
        return this.isNullOrUndefined(value);
      case 'array':
        return !this.isArray(value)
      case 'object':
        return !this.isObject(value);
      case 'interger':
        return !this.isNumber(value);
      case 'string':
        return !this.isString(value);
      case 'datetime':
        return !this.isDateTime(value);
      case 'date':
        return !this.isDate(value);
      case 'time':
        return !this.isTime(value);
      case 'email':
        return !this.isEmail(value);
      case 'boolean':
        return !this.isBoolean(value);
    }

    let isNumber = this.validateField('interger', value);
    let minValue = this.getNumber(rule);
    if (/min\:/g.test(rule)) {
      if (isNumber) return (value < minValue) ? true : false;
      else          return (value.length < minValue) ? true : false;
    }

    if (/max\:/g.test(rule)) {
      if (isNumber) return (value > minValue) ? true : false;
      else          return (value.length > minValue) ? true : false;
    }

    return true;
  }

  handle() {
    if (!this.isObject(this.rules)) throw new Error('Squirrel_orm make: rules is not object')
    if (!this.isObject(this.data))  throw new Error('Squirrel_orm make: data is not object')

    for(let field in this.rules) {
      let rules = this.rules[field].split('|');

      for(let rule of rules) {
        let failed = this.validateField(rule, this.data[field]);

        if (!failed) continue;
        this.failed = true;
        this.failedFields[field] = this.getMessage(field, rule);
      }
    }

    return this;
  }

  static make(all = {}, rules = {}, message = {}) {
    let model = new Validator(all, rules, message);
    return model.handle();
  }
}