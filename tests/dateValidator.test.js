const dateValidator = require('../utils/dateValidator')

test('Invalid Date', () => {
    const date = "13/13/2022"
    expect(() => dateValidator(date)).toThrow('Invalid Date')
})

test('Null Date', () => {
    const date = ""
    expect(() => dateValidator(date)).toThrow('Invalid Date')
})
test('Undefined Date', () => {
    expect(() => dateValidator()).toThrow('Invalid Date')
})
test('Date < CurrentDate ', () => {
    const date = "11/11/2022"
    expect(() => dateValidator(date)).toThrow('Invalid Date')
})
test('Correct Date', () => {
    const date = "12/12/2023"
    expect(dateValidator(date)).toBeDefined()
})