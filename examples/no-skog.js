/*
 * Same example as "server.js" but without Skog.
 * (see in that file the documentation of the example)
 *
 * In this file, comments only highlight the difference between skog and
 * no-skog versions.
 */
const bunyan = require('bunyan')
const parentLogger = bunyan.createLogger({
  name: 'example-app'
})

const sleep = time => new Promise((resolve) => setTimeout(resolve, time))

// To be able to log the lines WITH "req_id" info, we need to either pass
// "req" or "log" as parameter. We choose to pass "log".
async function getUser (log) {
  log.info('Getting user...')
  await sleep(Math.random() * 10)
  log.info('Got the user!')
}

async function server (req) {
  // We create a "child" logger with a "req_id" and pass it to the
  // "getUser" function
  const childLogger = parentLogger.child({ req_id: req.id })
  await getUser(childLogger)
}

function clients () {
  for (let i = 1; i <= 10; i++) {
    sleep(20 + Math.random() * 50)
      .then(() => server({ id: i }))
  }
}

clients()
