/*
 * Example implementing a fake server and fake parallel requests to show how
 * Skog is keeping data between functions.
 *
 * This example has three elements:
 * - `getUser` - a function simulating a long task (like fetching a user from a
 *   database).
 *
 * - `server(req)` - a function simulating a server accepting requests
 *
 * - `clients` - a function that simulates some requests. They come in random
 *   intervals
 *
 * In this example, "getUser" will output two log lines with a random delay in
 * between. Thanks to Skog:
 * - both log lines will contain the "req_id" useful to link both log lines
 *   even when more log lines are in between
 * - `getUser` does not receive neither `req_id` nor `log` as parameter.
 *
 * The file `server.log` in this same directory contains the log output.
 */

// In your project, you require 'skog/bunyan' instead
const skog = require('../bunyan')

// Initialize the logger
skog.createLogger({
  name: 'example-app'
})

// This one is just a "sleep" function that we are going to use to simulate a
// "long task"
const sleep = time => new Promise((resolve) => setTimeout(resolve, time))

// This is just a function that imitates a "long task", for example, reading a
// database
//
//   Note that this function doesn't contain any information about the "req ID"
//   but it will log it thanks to Skog
async function getUser () {
  skog.info('Getting user...')

  // We provoke here a random delay from 0-10 ms
  // This way calls to this function finish in different order
  await sleep(Math.random() * 10)
  skog.info('Got the user!')
}

// Let's create a fake server here. In our case, the server will be just
// one async function
async function server (req) {
  // Here we are creating a "child" logger with the "req_id" field.
  //
  // Even if the "getUser" takes an unknown amount of time, we keep the
  // "req_id" and logs are searchable
  await skog.child({ req_id: req.id }, async () => {
    await getUser()
  })
}

function clients () {
  for (let i = 1; i <= 10; i++) {
    // To add more randomness, the requests themself will be triggered
    // with a delay of 20-70 ms.
    sleep(20 + Math.random() * 50)
      .then(() => server({ id: i }))
  }
}

clients()
