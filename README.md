<div align="center">
<img src="media/logo.png" width="360">
<p>
Logging with <em>context</em> for Node.js
</p>
</div>

[![Build Status](https://travis-ci.org/KTH/skog.svg?branch=master)](https://travis-ci.org/KTH/skog)

Skog adds a "request ID" in your logs (so you can search easily)

Without passing "req" anywhere:

```js
const log = require("skog");

log.info("Hello!!");
```

---

## Features

- **Opinionated and familiar API**. Use _only_ these conventional functions for logging: `fatal`, `error`, `warn`, `info`, `debug` and `trace`.
- **[Lightweight](https://packagephobia.now.sh/result?p=skog)** mainly because Skog doesn't come with any logging library.
- **Flexible**. We offer functions specifically made for Bunyan and pino out of the box, but you can use Skog with **any** logger library (including `console`)

## Getting started

Install `skog` alongside with a logger (for example, pino)

```
npm i skog pino
```

Example with express:

```js
const log = require("skog");
const express = require("express");

// Initialize the logger.
// - If you use `.init.pino` you can pass the same parameters as in pino
log.init.pino({
  app: "example application",
});

const app = express();

// If you want to use our middleware, add it!
// - It will create a field called `req_id` (request id) for each request
app.use(log.middleware);

app.get("/", (req, res) => {
  // Then, use "log" as if you would do in a normal library.
  // - "req_id" will be there automagically
  // - You don't need to pass "req" anywhere
  log.info("A request is comming");
  anotherFunction();
  res.send("Hello world");
});

// You can also call `skog` from a different function.
// This is called inside a request so it will also log the "request ID"
// It will work even if the function is in a different file!
function anotherFunction () {
  log.info("Hello from another function");
}

// If you call `skog` outside of a request, it will NOT log the request ID
app.listen(3000, () => {
  log.info("Server started in port 3000");
});
```

## Customization

### Customize the middleware

The `log.middleware` shipped with skog creates a "child logger" and adds a field called `req_id`.

You can create your own middleware by using the `log.child` function:

```js
app.use(function customMiddleware(req, res, next) {
  log.child(
    { my_parameter: "my_value" },
    next, // Yes, you need to pass here the "next" function
  );
})
```

### Customize the logger

Skog is shipped with constructors for `bunyan` and `pino`.

If you want to use a different logger, use `log.setLogger` instead of initializing. The `customLogger` must be an object that maches this interface:

- 6 logging functions (called trace, debug, info, warn, error and fatal) that accept an arbitrary number of arguments and return nothing
- A "child" function that accepts one argument and returns a new logger

For example, if you want to use `console` for logging and not do anything special for `child`:

```js
const log = require("skog");

const customLogger = {
  trace: (...args) => console.log(...args),
  debug: (...args) => console.debug(...args),
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  fatal: (...args) => console.error(...args),
  child: () => customLogger,
};
log.setLogger(customLogger);
```

(actually it is the default logger if you don't initialize it)
