<div align="center">
<img src="media/logo.png" width="360">
<p>
Logging with context for Node.js
</p>
</div>

[![Build Status](https://travis-ci.org/KTH/skog.svg?branch=master)](https://travis-ci.org/KTH/skog)

## Features

- **Opinionated and familiar API**. Use _only_ these conventional functions for logging: `fatal`, `error`, `warn`, `info`, `debug` and `trace`.
- **Lightweight**. [Less than 300 kB](https://packagephobia.now.sh/result?p=skog) mainly because Skog doesn't come with any logging library.
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
  // - You don't need to use "req" anywhere
  log.info("A request is comming");
  res.send("Hello world");
});

app.listen(3000, () => {
  log.info("Server started in port 3000");
});
```
