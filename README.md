# Skog

[![Build Status](https://travis-ci.org/KTH/skog.svg?branch=master)](https://travis-ci.org/KTH/skog)

Skog is a Node.js library on top of Bunyan for logging that keeps track of the child loggers you create.

Install it with `bunyan` (in a future, Winston and Pino will be supported)

```
npm install bunyan skog
```

As early as possible in your application, require and configure `skog/bunyan`.

```js
require('skog/bunyan').createLogger({
  name: 'my-app'
})
```

Then, in your modules, call the Skog functions like a regular library. Skog keeps track of the child loggers:

```js
const skog = require('skog/bunyan')

async function getUser () {
  skog.info('Reading DB ')
  await longTask()
  skog.info('DB read!   ')
}
```

For real, it keeps track of the child loggers **without passing them everywhere**. For example, if you want to create one per request in your Express server:


```js
const skog = require('skog/bunyan')

server.get(async function handleRequest (req, res) {
  // Here we are creating a child logger with a `req_id` field:
  await skog.child({ req_id: req.id }, async () => {
    // Inside this callback, `skog` is pointing to the child logger:
    skog.debug('<- Incoming request')

    // `getUser` will also use a logger that contains the `req_id` field
    const user = await getUser()

    skog.debug('-> Sending response')
    res.send(user)
  })
})
```

## Without Skog

Traditionally, with all logging libraries (Bunyan, Winston, Pino...) you create a instance (let's say `logger`) and call the functions of that object.

If you need the `logger` across several modules, you need to pass that object around. Specially if you want to use child logging:

```js
const bunyan = require('bunyan')
const logger1 = bunyan.createLogger({
  name: 'my-app',
  level: 0
})

async function getUser (logger) {
  logger.info('Reading DB ')
  await longTask()
  logger.info('DB read!   ')
}

async function getPosts (user, logger) {
  logger.info('Calling API')
  await longTask()
  logger.info('API called!')
}

server.get(async function handleRequest (req, res) {
  const logger2 = logger1.child({ req_id: req.id })
  logger2.debug('<- Incoming request')
  const user = await getUser(logger2)
  const posts = await getPosts(user, logger2)
  logger2.debug('-> Sending response')
  logger2.send(posts)
})
```

# bunynan-like API in `skog/bunyan`

Intentionally, the API of `skog/bunyan` is very very similar to `bunyan`. However, all the functions are in the library instead of in a "logger instance":

## Log creation: `skog.createLogger(options)`

Accepts the same options as the [bunyan Constructor API](https://github.com/trentm/node-bunyan#constructor-api). However `skog.createLogger` does not return anything:

```js
skog.createLogger({
  name: <string>,                     // Required
  level: <level name or number>,

  // Any other fields are added to all log records as is.
  foo: 'bar',
  ...
});
```

## Log method API

The `skog/bunyan` logging API is equivalent to the `bunyan` logging API:

```js
skog.info('hi')                     // Log a simple string message (or number).
skog.info('hi %s', bob, anotherVar) // Uses `util.format` for msg formatting.

skog.info({foo: 'bar'}, 'hi')
                // The first field can optionally be a "fields" object, which
                // is merged into the log record.
// etc.
```

## Child loggers: `skog.child(options, callback)`

Skog has also a concept of child logger. However, instead of specializing the logger for a sub-component, it is useful for **specializing the logger for an execution context**.

In the following example, a new child logger is created with "request id" information. Whenever `skog` is called *inside the callback*, it will use the child logger (with the request id)

```js
server.get(async function handleRequest (req, res) {
  // Here we are creating a child logger with a `req_id` field:
  await skog.child({ req_id: req.id }, async () => {
    // Inside this callback, `skog` is pointing to the child logger:
    skog.debug('<- Incoming request')

    skog.debug('-> Sending response')
    res.send(user)
  })
})
```

Note that it works for synchronous and asynchronous functions. The reason is that whatever you return in the callback function, it will be returned by `skog.child`:

```js
const a = skog.child(options, () => {
  skog.info('inside')
  return 5
})

// Now a = 5
```

It means, that if you pass an async function as callback (a function that returns a Promise), the promise is returned by `skog.child` and you can `await` it:

```js
await skog.child(options, async () => {
  skog.info('inside')
})

// This line is executed after the async function
something()
```