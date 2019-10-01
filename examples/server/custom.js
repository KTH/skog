/**
 * This file shows how to create a custom logger.
 */

// In your project, you require 'skog' instead
const skog = require('../..')

// In this example, we are implementing a custom logger library.
// It is recommended that at least a "child" method is implemented to be able
// to create child loggers.
skog.logger = {
  info: (msg) => console.log(msg),
  child: (attrs) => ({
    info: (msg) => console.log(attrs, msg)
  })
}

// This "clients" function simulates 10 requests with random delays in between
const { sleep, server } = require('./server')

async function clients () {
  for (let i = 1; i <= 10; i++) {
    await sleep(Math.random() * 10)
    server({ id: i })
  }
}

clients()
