# Skog core

Abstractions on top of [native Node.js Asynchronous context tracking](https://nodejs.org/api/async_context.html) to help you create loggers with context.

---

The **logger** module is:

- An interface. Since we are using different logging libraries (bunyan, pino, etc), we want to define a common interface to unify them.

This package includes:

- A TypeScript interface for loggers
- A `console`-based implementation of that interface
- A express middleware for adding a request ID
- Low level API to **store/read values from an async context** and to **create async contexts on runtime**

## Low level API

```ts
import { skogify, getFields, setFields } from "skog";

// Implement sleep for convinience:
function sleep(t) {
  return new Promise((accept) => {
    setTimeout(accept, t);
  });
}

// We declare a function that will read the values
function printCurrentId() {
  // We get the stored fields in the current context
  const { id } = getFields();

  console.log(`ID is ${id}`);
}

// We declare a function that will set the value
let newId = 0;
function setCurrentId() {
  newId++;
  setFields({ id: newId });
}

// This function will set the current ID and print it
async function _handle() {
  setCurrentId();

  // We print ID with timeouts to demonstrate that correct IDs will be printed
  await sleep(Math.random() * 1000);
  printCurrentId();
  await sleep(Math.random() * 1000);
  printCurrentId();
}

// To be able to use Async Contexts, functions that call "getFields" and
// "setFields" must be "skogified". It can be done globally
const handle = skogify(_handle);

// Optional. We initialize the id:
setFields({ id: 0 });

// We run `handle` 10 times in parallel:
Promise.all(Array.from({ length: 10 }).map(() => handle()));
```
