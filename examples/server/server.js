/**
 * This module implements a fake server used in all Skog examples:
 *
 * - `getUser` - a function simulating a long task (like fetching a user from a
 *   database).
 *
 * - `server(req)` - a function simulating a server accepting requests
 */

// See how we don't need to configure anything from this module. Just require
// skog.
const skog = require('../..')

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
module.exports = {
  sleep,
  async server (req) {
    // Here we are creating a "child" logger with the "req_id" field.
    //
    // Even if the "getUser" takes an unknown amount of time, we keep the
    // "req_id" and logs are searchable
    await skog.child({ req_id: req.id }, async () => {
      await getUser()
    })
  }
}
