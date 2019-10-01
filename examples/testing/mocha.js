process.env.NODE_ENV = 'test'
/** Test file example implemented with Mocha */
const skog = require('../../index')
const assert = require('assert')

function sum (a, b) {
  skog.info(`Hello from the "sum" function! ${a}+${b}`)
  return a + b
}

describe('Sum function', function () {
  it('should return 2 when 1+1', function () {
    assert.equal(sum(1, 1), 2)
  })

  it('should return 5 when 2+3', function () {
    skog.logger = {
      info: console.log
    }
    assert.equal(sum(2, 3), 5)
  })
})
