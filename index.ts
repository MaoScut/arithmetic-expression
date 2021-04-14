enum CharType {
  plus = '+',
  minus = '-',
  divide = '/',
  multi = '*',
  leftPar = '(',
  rightPar = ')',
  space = ' ',
  number = 'number',
}

/**
 * basic target: support +,-,*,/ and (), integer
 * 
 * syntax:
 * 
 * expr: addend (+|- addend)*
 * addend: factor (*|/ factor) *
 * factor: num |  ( expr )
 */
export class Parser {

  pointer = 0

  exprStr = ''
  public parse(exprStr: string) {
    this.exprStr = exprStr
    this.pointer = 0
    return this.expr()
  }

  private expr() {
    let result = this.addend()
    this.skipSpaces()
    while (this.notEnd() && ['+', '-'].includes(this.getCurrent())) {
      if (this.getCurrent() === '+') {
        this.eat(CharType.plus)
        const factor = this.addend()
        result += factor
      } else if (this.getCurrent() === '-') {
        this.eat(CharType.minus)
        const factor = this.addend()
        result -= factor
      } else {
        this.throwError()
      }
    }
    return result
  }

  private addend() {
    let result = this.factor()
    this.skipSpaces()
    while (this.notEnd() && ['*', '/'].includes(this.getCurrent())) {
      if (this.getCurrent() === '*') {
        this.eat(CharType.multi)
        this.skipSpaces()
        const right = this.factor()
        result *= right
      } else if (this.getCurrent() === '/') {
        this.eat(CharType.divide)
        this.skipSpaces()
        const right = this.factor()
        result /= right
      } else {
        this.throwError()
      }
    }
    return result
  }

  private factor() {
    if (this.getCurrent() === '(') {
      this.eat(CharType.leftPar)
      const result = this.expr()
      this.eat(CharType.rightPar)
      return result
    }
    return this.num()
  }

  private num() {
    // 保证起码有一个
    let str = this.getCurrent()
    this.eat(CharType.number)
    while (this.notEnd() && /\d/.test(this.getCurrent())) {
      str += this.getCurrent()
      this.eat(CharType.number)
    }
    return Number(str)
  }

  private skipSpaces() {
    while (this.notEnd() && this.getCurrent() === ' ') {
      this.eat(CharType.space)
    }
  }

  private notEnd() {
    return this.pointer < this.exprStr.length
  }

  private getCurrent() {
    return this.exprStr[this.pointer]
  }

  private eat(type: CharType) {
    const curr = this.getCurrent()
    const exactlyType = [CharType.divide, CharType.leftPar, CharType.minus, CharType.multi, CharType.plus, CharType.rightPar, CharType.space]
    if (exactlyType.includes(type)) {
      if (curr !== type) {
        this.throwError()
      }
    } else if (type === CharType.number) {
      if (!/\d/.test(curr)) {
        this.throwError()
      }
    } else {
      throw `unknown type ${type}`
    }
    this.pointer++
  }

  private throwError() {
    throw new Error(`unexpected token ${this.exprStr[this.pointer]}, position: ${this.pointer}`)
  }
}

