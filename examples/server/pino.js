/**
 * This file shows how to create a Pino logger.
 */

// In your project, you require 'skog' instead
const skog = require('../..')

// Just create a logger and set it to `skog.logger`
skog.logger = require('pino')()

// From here, we dispatch the requests to the server
const { sleep, server } = require('./server')

async function clients () {
  for (let i = 1; i <= 10; i++) {
    await sleep(Math.random() * 10)
    server({ id: i })
  }
}

clients()
