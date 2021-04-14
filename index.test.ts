import { Parser } from "."

describe('parser test', () => {
  let parser: Parser
  beforeEach(() => {
    parser = new Parser()
  })
  test('plus', () => {
    const result = parser.parse('1+2+3')
    expect(result).toBe(6)
  })
  test('plus multi', () => {
    const result = parser.parse('1+2*3')
    expect(result).toBe(7)
  })
  test('plus, parentheses, multi', () => {
    const result = parser.parse('(1+2)*3')
    expect(result).toBe(9)
  })
  test('plus, parentheses, multi, multiple digits', () => {
    const result = parser.parse('(1+999)*3')
    expect(result).toBe(3000)
  })
  describe('invalid', () => {
    test('lack addend', () => {
      const str = '1+'
      expect(() => {
        parser.parse(str)
      }).toThrow()
    })
    test('not number', () => {
      const str = 'a+1'
      expect(() => {
        parser.parse(str)
      }).toThrow()
    })
    test('parentheses not match', () => {
      const str = '(123+345'
      expect(() => {
        parser.parse(str)
      }).toThrow()
    })
  })
})