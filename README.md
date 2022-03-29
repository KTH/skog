<div align="center">
<img src="media/skog-logo.png" width="384">
<p>
Add <em>context</em> to your Node.js logs
</p>
<em>Forest photo by <a href="https://unsplash.com/photos/d6kSvT2xZQo">Gustav Gullstrand</a> on <a href="https://unsplash.com">Unsplash</a></em>
</div>

# Getting started

Skog lets you add context to your logs without hassle. For example, if you have a Express server and want to add a field called `req_id` to every log so you can group logs by request, use the `skogMiddleware`

```ts
import { skogMiddleware } from "skog";
import express from "express";

const app = express();
app.use(skogMiddleware);
```

Then, you can use skog anywhere to just log stuff:

```ts
import log from "skog";

export function getUser(id) {
  // ...
  log.info(`Getting user with ID ${id}`);
}
```

# How it works

[ TODO ]

Skog uses **Pino.js** for sending structured logs to the console

# Recipes

Skog offers you a simple interface to be able to make your own integrations easily, for example:

- **Create a middleware for different web frameworks**.
- **Add different attributes to the logs**. For example, you might want to add _session ID_ or _user ID_

# API

[under development]
