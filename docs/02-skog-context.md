# Async Context in Skog

In this page you will learn more on how Skog uses Async Context and how the functions `runWithSkogContext` and `getFields` can help you to make integrations using its power.

- Both functions handle **Node.js Async Context**. If you don't know what it is, you can read about it [here](./01-nodejs-context.md).
- This page is not the API reference of the functions but an explanation of them. [ todo: create such page and add a link to it here ]

---

- The function **runWithSkogContext** receives two arguments: `fields` (an object) and `callback` (a zero-argument function).

  It will create a new context with `fields`. The context will be alive during the execution of the `callback`.

  It will return the same value as the value returned by the callback.

- The function **getFields** returns the `fields` in the current execution context. Will return null if no fields are set or if called outside of an execution context.

  All logging functions (`log.info`, `log.error`, etc.) call `getFields` internally and will add the fields to the logging object.

In this page we are going to show how to create two different middleware:

1. **A middleware for Express** that will set a `req_id` field in every request containing an ID
2. **A middleware for Next.js** that will set a `session_id` field. That will contain the user session ID which is very useful to see all the requests that come from the same user

---

## A middleware for express: `skogMiddleware`

Let's implement `skogMiddleware` (the one that is shipped with Skog) with the functions in this page.

Since it is an Express middleware, it will be a function with the following header:

```ts
function skogMiddleware(req, res, next);
```

First, let's define which fields we are going to add into the context. In our case, we want to add a field called `req_id` that identifies a request. Express does not generate any ID for requests, so we are going to use a ID generator library to do it:

```ts
function skogMiddleware(req, res, next) {
  const fields = { req_id: nanoid() };
}
```

Now, we need to open a context that will live during the entire request handling. The `next` function refers to the request handler and any other middleware in between, so that's what we need as callback for `runWithSkogContext`:

```ts
function skogMiddleware(req, res, next) {
  const fields = { req_id: nanoid() };

  runWithSkogContext(fields, next);
}
```

Done!

## A middleware for Next.js

According to the [docs](https://nextjs.org/docs/api-reference/next/server), a middleware in Next.js is a function as follow:

```ts
function middleware(req: NextRequest, ev: NextFetchEvent) {
  return new Response("Hello, world!");
}
```

First, let's define the fields we want. In our case we want the **user session ID** which we can take from the cookies

```ts
function middleware(req: NextRequest, ev: NextFetchEvent) {
  const fields = {
    // For security reasons, we are not going to log the entire session ID
    // only the last 6 characters which should be good enough to search in the
    // logs
    session_id: req.cookies["session_id"]?.slice(-6),
  };
}
```

Then, we need access to the "next" function, the one that will continue the middleware chain and pass it to `runWithSkogContext`.

```ts
import { NextResponse } from "next/server";

function middleware(req: NextRequest, ev: NextFetchEvent) {
  const fields = {
    session_id: req.cookies["session_id"]?.slice(-6),
  };

  runWithSkogContext(fields, NextResponse.next);
}
```

Finally, the middleware should return a response. In our case we are not manipulating the response, so we just need to return the value returned by the next middleware chain, so the value returned by `NextResponse.next`.

Luckily, `runWithSkogContext` will return the value returned by its callback. In our case: `runWithSkogContext` returns what is returned by `NextResponse.next`.

```ts
import { NextResponse } from "next/server";

function middleware(req: NextRequest, ev: NextFetchEvent) {
  const fields = {
    session_id: req.cookies["session_id"]?.slice(-6),
  };

  // Just adding "return" here is enough
  return runWithSkogContext(fields, NextResponse.next);
}
```

Done!
