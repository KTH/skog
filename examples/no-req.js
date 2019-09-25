/*
 * Same example as "server.js" but without Skog and without using child
 * loggers.
 *
 * The generated output "no-req.log" contains no information about"req_id" which
 * makes it hard (almost impossible) to link log lines each other.
 */
const bunyan = require('bunyan')
const log = bunyan.createLogger({
  name: 'example-app'
})

const sleep = time => new Promise((resolve) => setTimeout(resolve, time))

// This is a good API for getUsers. We want to keep it!
async function getUser () {
  log.info('Getting user...')
  await sleep(Math.random() * 10)
  log.info('Got the user!')
}

async function server () {
  // We are not passing any information from this function to "getUser"
  await getUser()
}

function clients () {
  for (let i = 1; i <= 10; i++) {
    sleep(20 + Math.random() * 50)
      .then(() => server({ id: i }))
  }
}

clients()
