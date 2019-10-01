/**
 * Example implementing a fake server and fake parallel requests to show how
 * Skog is keeping data between functions, even when they are in different
 * modules.
 *
 * The function "getUser" inside `server.js` will output two log lines with a
 * random delay in between. Thanks to Skog:
 *
 * - both log lines will contain the "req_id" useful to link both log lines
 *   even when more log lines are in between
 * - `getUser` does not receive neither `req_id` nor `log` as parameter.
 *
 * The file `bunyan.log` in this same directory contains the log output.
 */
const { sleep, server } = require('./server')

// Initialize the bunyan logger.
// In your project require 'skog/bunyan' instead
require('../bunyan').createLogger({
  name: 'example-app'
})

// This "clients" function simulates 10 requests with random delays in between
async function clients () {
  for (let i = 1; i <= 10; i++) {
    await sleep(20 + Math.random() * 50)
    server({ id: i })
  }
}

clients()
