<div align="center">
<img src="media/logo.png" width="360">
<p>
Declarative logging for Node.js
</p>
</div>


[![Build Status](https://travis-ci.org/KTH/skog.svg?branch=master)](https://travis-ci.org/KTH/skog)

Skog is a Node.js library on top of Bunyan for logging that **keeps track of the child loggers** you create.

## Installation

Install both `skog` and `bunyan`

```
npm install bunyan skog
```

## Usage

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

See the [full example](examples/server.js) and the [log output](examples/server.log)

<details>
<summary>Without Skog</summary>

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

</details>

# API

Intentionally, the API of `skog/bunyan` is very very similar to `bunyan`. However, with Skog, **you don't create a "logger" instance**.

| Bunyan                           | Skog
|:---------------------------------|:----------
| `logger = bunyan.createLogger()` | `skog.createLogger()`
| `logger.info('hi')`, etc.        | `skog.info('hi')`, etc.
| `child = logger.child()`         | `skog.child()`

## `skog.createLogger(options)`

Sets up the global Skog instance (internally a Bunyan instance).

Accepts the same options as the [bunyan Constructor API](https://github.com/trentm/node-bunyan#constructor-api) but **without returning anything**:

```js
skog.createLogger({
  name: <string>,
  level: <level name or number>,

  // Any other fields are added to all log records as is.
  foo: 'bar',
  ...
});
```

Skog internally will call the Bunyan constructor so you can pass any accepted option by Bunyan. For example, serializers:

```js
const bunyan = require('bunyan')
const skog = require('skog/bunyan')

skog.createLogger({
  name: 'my-app',
  serializers: bunyan.stdSerializers
})
```

## `skog.fatal()`, `skog.info()`...

The `skog/bunyan` logging API is a subset of the `bunyan` logging API. The following methods are equivalent in Skog and Bunyan and accept the same parameters.

 Bunyan                      | Skog
|:---------------------------|:----------
| `logger.trace('hi')`       | `skog.trace('hi')`
| `logger.debug('hi')`       | `skog.debug('hi')`
| `logger.info('hi')`        | `skog.info('hi')`
| `logger.warn('hi')`        | `skog.warn('hi')`
| `logger.error('hi')`       | `skog.error('hi')`
| `logger.fatal('hi')`       | `skog.fatal('hi')`

*Other bunyan methods (like custom levels) are not implemented.*

## `skog.child(options, callback)`

The `.child` method replaces the original `logger.child` method in Bunyan. In Skog you pass a `callback` to the `child` function. When you call `skog` inside the callback, it will call the child logger.

For example, imagine that you want to use a different child logger for every request in an Express server:

```js
const skog = require('skog/bunyan')
skog.createLogger({ name: 'my-app' })

server.get(async function handleRequest (req, res) {
  // Here we are creating a child logger with a `req_id` field
  await skog.child({ req_id: req.id }, async () => {
    // Inside this callback, `skog` is pointing to the child logger:
    skog.debug('<- Incoming request')

    skog.debug('-> Sending response')
    res.send(user)
  })
})
```

See the full example [here](/examples/server.js)

As you can see in the example, you can pass both a synchronous or an async function.

<details>
<summary>Explanation</summary>

Whatever you return in the callback function, it will be returned by `skog.child`:

```js
const a = skog.child(options, () => {
  skog.info('inside')
  return 5
})

// Now `a` has a value of `5`
```

It means, that if you pass an async function as callback (a function that returns a Promise), the promise is returned by `skog.child` and you can `await` it:

```js
const a = skog.child(options, async () => {
  // This "callback" function returns a Promise because it is an async function
  skog.info('inside')
})


// Now "a" is the Promise returned by the callback:
await a
```

This means also that any error thrown by the callback is propagated outside of `skog.child`:

```js
try {
  await skog.child({}, async () => {
    throw new Error()
  })
} catch (err) {
  // Here we get the "Error" thrown inside the callback
}
```

</details>
