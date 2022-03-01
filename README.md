<div align="center">
<img src="media/logo.png" width="360">
<p>
Add <em>context</em> to your Node.js logs
</p>
</div>

## Structure

[ UNDER DEVELOPMENT ]

Skog is all about _async context and logging stuff_: it uses **Async Context** to store what is going to be logged and then different libraries to **log stuff**. This repo will contain at least three packages:

- [**skog-core**](./packages/skog-core/). A "Logger" interface (without implementation) and functions for handling Async Context. Use this if you are making integrations with different logging libraries or if you want to use

  This package would be: as small as possible, wihthout almost any dependencies. It will expose as many low-level functions as possible to maximize customization.

- **skog-pino**. Pino logging library with Skog.

- **skog**. Opinionated no-config logging library. It contains decisions like "when in test, use `console`; in prod, use `pino`", etc.

## Getting started

[ UNDER DEVELOPMENT ]

Let's say you have an express app, and you want to add a `req_id` field to all logs:

```js
import log, { skogExpressMiddleware } from "skog";
// OR: import log, { skogMiddleware } from "skog-bunyan"
// OR: import log, { skogMiddleware } from "skog-pino"
import express from "express";

const app = express();

app.use(skogExpressMiddleware); // Just add this line!
app.get("/", (req, res) => {
  // Now, all logs will have "req_id"
  // And you are still using the "global" log object
  // - You don't need to pass `req_id` explicitly
  // - Or the `req` object
  log.info("A request is comming");
  anotherFunction();
  res.send("Hello world");
});

// You can also call `skog` from a different function.
function anotherFunction() {
  // Here, you will also have the "req_id"
  // Look: you are always using the global `log` object.
  log.info("Hello from another function");
}

app.listen(3000, () => {
  // If you log outside of a request, it will NOT include `req_id`
  log.info("Server started in port 3000");
});
```
