const bunyan = require('../bunyan')
const test = require('ava')

test('Should the errors be propagated', async t => {
  bunyan.createLogger({ name: 'example' })

  try {
    await bunyan.child({ a: 2 }, async () => {
      throw new Error('hola')
    })
  } catch (e) {
    t.is(e.message, 'hola')
  }
})
