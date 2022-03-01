# skog-core

**skog-core** are a collection of functions that help you create loggers with context

## Getting started

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

## References

- [Asynchronous context tracking](https://nodejs.org/api/async_context.html), Official Node.js documentation
