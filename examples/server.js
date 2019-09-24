/*
 * Example implementing a fake server and fake parallel requests
 * to show how Skog works
 *
 *   `server.log` contains the logs output after running this example.
 *
 * You can see how logs can be in different order but they all have the "req_id"
 * field that can be used to connect each pair of logs.
 */

// In your project, you require 'skog/bunyan'
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

  // We provoke here a random delay from 10-20 ms
  // This way calls to this function finish in different order
  await sleep(Math.floor(Math.random() * 10) + 10)
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
  for (let i = 0; i < 100; i++) {
    server({
      id: i
    })
  }
}

clients()
