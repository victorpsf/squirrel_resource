module.exports = class Utilities {
  constructor() {}

  superCharacter() {
    return '^.,;:<>|\\][{}=+§_-)(*&%$#@!"\'£¢¬ºª'
  }

  numberCharacter() {
    return '0123456789'
  }

  randomNumber(min, max) {
    let decimalHouse = 10
    let randValue = 0

    if (min > max) {
      let _min = max
      max = min
      min = _min
    }

    while(decimalHouse < max) {
      if (decimalHouse * 10 < max) 
        decimalHouse *= 10
      else 
        decimalHouse += 10
    }

    do {
      randValue = Math.floor(Math.random() * decimalHouse)
    } while(randValue < min && max > randValue)

    return randValue
  }

  randomString(len, use = { super: false, numeric: false }) {
    let characters = 'abcdefghijklmnopqrstuvxywz'
    let string = ''

    if (use) {
      if (use.super) characters += this.superCharacter()
      if (use.numeric) characters += this.randomNumber()
    }

    for(let x = 0; x < len; x++) {
      let y = this.randomNumber(0, characters.length - 1)
      string += characters[y]
    }

    return string
  }
}