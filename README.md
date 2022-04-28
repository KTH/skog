<div align="center">
<img src="media/skog-logo.png" width="384">
<p>
Add <em>context</em> to your Node.js logs
</p>
<em>Forest photo by <a href="https://unsplash.com/photos/d6kSvT2xZQo">Gustav Gullstrand</a> on <a href="https://unsplash.com">Unsplash</a></em>
</div>

# Getting started

Skog is a opinionated logging library built on top of Pino.

```
npm install skog
```

```ts
import log, { initializeLogger } from "skog";

initializeLogger();
setFields({ app: "my-app" });
log.info("Hello world");
```

## Add `req_id` to every log

Use `skogMiddleware` with an express server. It will add `req_id` to every log line.

```ts
import log, { initializeLogger, skogMiddleware, setFields } from "skog";
import express from "express";

const app = express();

const app = express();
app.use(skogMiddleware);
app.get("/", () => {
  // This will log "req_id" automatically! You don't need to do anything else!
  log.info("Logging a message");
});

initializeLogger();
setFields({ app: "demo" });
app.listen(3000, () => {
  log.info("Starting server");
});
```

# Features

`skog` is heavily opinionated:

- It uses the "bunyan" convention. Logging methods are called `trace`, `debug`, `info`, `warn`, `error` and `fatal`
- `initializeLogger` will activate Pino. After the initialization, all logs will be output as JSONLD format
- Before initialization, `skog` will use `console` to print logs.

# How it works

`skog` exports more functions so you can create your own middleware. For example, if you want to add your own fields or if you want to create middleware for other frameworks.

## Add other fields

Example: add a "session_id" field in your logs

```ts
import { runWithSkog } from "skog";
import { nanoid } from "nanoid";

function myMiddleware(req, res, next) {
  // Assuming that "req.session.id" exists...
  runWithSkog({ req_id: nanoid(), session_id: req.session.id.slice(-3) }, next);
}
```

## Middleware for other frameworks

As you can see from the example above, `runWithSkog` accepts two arguments: an object with fields and a function. `runWithSkog` will return the same thing as returned by the function.

So, you can create a middleware for Next.js:

```ts
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

function middleware(req: NextRequest, ev: NextFetchEvent) {
  return runWithSkogContext(
    {
      session_id: req.cookies["session_id"]?.slice(-3),
      req_id: nanoid(),
    },
    NextResponse.next
  );
}
```
