const express = require('express')
const log = require('../../index') // In your code, require('skog')
const cuid = require('cuid')

// As early as possible, we initialize "skog"
require('../../bunyan').createLogger({ // In your code, require('skog/bunyan')
  name: 'skog-example-express',
  serializers: require('bunyan').stdSerializers
})

// This is just a "long task"
// Will log the "req_id" even without passing it!
async function longTask () {
  log.info('This is a long task')
  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  })
  log.info('Returning...')
  return Math.random()
}

const app = express()

// We can set a middleware so EVERY request has a req_id
app.use((req, res, next) => {
  log.child({ req_id: cuid() }, next)
})
app.get('/', async (req, res) => {
  log.info({ req }, 'Someone is coming...')
  const number = await longTask()
  log.info(`Number is ${number}`)
  res.send(`Hi! Your number is ${number}`)
})

app.listen(3000, () => {
  log.info('Starting in port 3000')
})
