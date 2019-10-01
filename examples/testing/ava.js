const test = require('ava')
const skog = require('../../index')

function sum (a, b) {
  skog.info(`Hello from the "sum" function! ${a}+${b}`)
  return a + b
}

test('1 + 1 should be 2', t => {
  // In testing environments, logger is by default MUTED.
  // See how the following test will not output any log:
  t.is(sum(1, 1), 2)
})

test('2 + 3 should be 5', t => {
  // AVA contains a custom function `t.log` to log stuff. You can override the
  // default logger this way:
  skog.logger = {
    info: t.log
  }
  t.is(sum(2, 3), 5)
})
