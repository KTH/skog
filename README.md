<div align="center">
<img src="media/skog-logo.png" width="384">
<p>
Add <em>context</em> to your Node.js logs
</p>
<em>Forest photo by <a href="https://unsplash.com/photos/d6kSvT2xZQo">Gustav Gullstrand</a> on <a href="https://unsplash.com">Unsplash</a></em>
</div>

# Getting started

Skog is an opinionated logging built on top of Pino and AsyncContext to be able to log context effortlessly

For example, if you have a Express server and want to add a field called `req_id`, you can just use the `skogMiddleware`

```ts
const { default: log, skogMiddleware, initializeLogger } = require("skog");
const express = require("express");
const app = express();

app.use(skogMiddleware);
app.get("/", () => {
  log.info("Logging a message");
});

initializeLogger();
app.listen(3000, () => {
  log.info("Starting server");
});
```

# Continue reading

- [Async Context in Node.js](./docs/01-nodejs-context.md). Explains the technology behind Skog.
- [How Async COntext is used in Skog](./docs/02-skog-context.md). Explains how do we use Async Contexts in Skog and how can you build your own integrations

<!--
# In depth explanation

# Recipes

Skog offers you a flexible interface that you can use to make your own integrations easily, for example:

- **Add different attributes to the logs**. For example, you might want to add _session ID_ or _user ID_
- **Create a middleware for different web frameworks**.

# Contribute to Skog

[ todo ]

# API Reference

[ todo ]
-->
