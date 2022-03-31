# How do Node.js Contexts works

Skog uses **Async Context Tracking** under the hood, a feature introduced in Node.js 14. Unfortunately it is not well documented so we will try to explain it here.

If you are familiar with React, you will find that Contexts in React and Node.js Async Context have similarities.

- In React, **Contexts** provide a way to pass data through components without having to pass props down manually at every level.

- In Node.js, **Async Contexts** provide a way to pass data through functions without having to pass arguments manually at every function call.

Typically, your code is composed by functions (or methods). For example, a function `a()` might call a function `b()` that calls a function `c()`. If the function `c()` needs some data from the function `a()`, such data is passed via arguments. Example:

```ts
function a() {
  b("Hello");
}

function b(message) {
  c(message);
}

function c(message) {
  // Do something with "message"
}
```

This is **entirely fine in 99% of the applications** and, like Contexts in React, you should not use Node.js Async Contexts just to avoid passing parameters.

Contexts (both in React and Node.js) is usually a tool that is more useful when developing a library or a framework where you have **partial** access to your data.

In the example above, imagine that you are building a library with the functions `a` and `c`, but the function `b` is provided by the user. In this case, such function will be provided as a callback.

```ts
import { a, c } from "a-library";

a(function b() {
  c();
});
```

Now, let's imagine that you are building the library (and the functions `a` and `c`) and you need to pass some value from `a` to `c`, maybe a value generated everytime the user calls `a`

```ts
export function a(callback) {
  // Let's suppose that we have a ID generator function
  const message = generateId();
}

export function c() {
  // How do I receive the "message" from `a`?
}
```

One easy way would be using a global variable:

```ts
let message = "";
export function a(callback) {
  // The "generate ID" will generate unique IDs everytime is called
  message = generateId();

  callback();
}

export function c() {
  // Do something with `message`
  console.log(message);
}
```

But... In the following example, can you guarantee that the `message` when calling `c` is correct?

```ts
import { a, c } from "a-library";

// Which one will execute "c" first? "b" or "b2"?
a(function b() {
  setTimeout(Math.random() * 1000, c);
});

a(function b2() {
  setTimeout(Math.random() * 1000, c);
});
```

And this is where **Async Contexts** come into play. With Context you can put certain data to an _execution context_, and be able to read the data in the _current execution context_.

In the example above, `a` would create a context and `c` reads the data in the context. That way, `a` can set the "message" and `c` can read it.

Skog uses Async Contexts exactly for that:

```ts
// `skogMiddleware` is like "a" in the previous examples.
// It "creates a context" and generates a "request ID"
//
// Since this is a middleware we cannot control how many middleware you have
// between this line and where we need the ID
app.use(skogMiddleware);

app.get("/", () => {
  // Under the hood, the `log.info` function is reading the data provided by the
  // context when it was created (when `skogMiddleware` runs)
  log.info("Hello world");
});
```

---

Now that you know what are Async Contexts in Node.js, you can read on [how do we use them in Skog](./02-skog-context.md)
