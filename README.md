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

As soon as possible in your app, initialize `skog` with Pino:

```js
require("skog").init.pino({
  app: "my-application",
});
```

When need it, just use it:

```js
const log = require("skog");

log.info("Hello world");
```

Optional. You can add it as express middleware. In that case, all log lines will come with a field called `req_id` that identifies the request:

```js
const skog = require("skog");
const express = require("express");
const app = express();

app.use(skog.middleware);
```
