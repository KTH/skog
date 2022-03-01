# skog-core

**skog-core** are a collection of functions that help you create loggers with context

## Getting started

This is the "example implementation" of the Skog interface. If you are implementing a logging library with Skog, it should behave similar to the following example:

```js
import { skogMiddleware, consoleLog as log } from "skog-core";
import express from "express";

function greet(name) {
  log.info(`Hello ${name}`);
}

const app = express();
app.use(skogMiddleware);
app.get("/", (req, res) => {
  log.info("Request received");
  greet(req.query.name);
  res.send(`Hello ${req.query.name}`);
});

app.listen(3000, () => {
  log.info("Starting server");
  greet("world");
});
```

Full example with comments [here](./examples/00-express.mjs).

## Explanation

Example using the "low level" API (for making your own implementation) [here](./examples//01-lowLevel.mjs)

## References

- [Asynchronous context tracking](https://nodejs.org/api/async_context.html), Official Node.js documentation
