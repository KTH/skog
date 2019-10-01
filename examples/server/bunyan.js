/**
 * This file shows how to create a logger with Bunyan.
 *
 * The file `bunyan.log` in this same directory contains the log output.
 */

// Initialize the bunyan logger.
// In your project require 'skog/bunyan' instead
require('../../bunyan').createLogger({
  name: 'example-app'
})

// From here, we dispatch the requests to the server
const { sleep, server } = require('./server')

async function clients () {
  for (let i = 1; i <= 10; i++) {
    await sleep(Math.random() * 10)
    server({ id: i })
  }
}

clients()
