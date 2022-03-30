# Async Context in Skog

In this page you will learn more on how Skog uses Async Context and how the functions `runWithSkogContext` and `getFields` can help you to make integrations using its power.

- Both functions handle **Node.js Async Context**. If you don't know what it is, you can read about it [here](./01-nodejs-context.md).
- This page is not the API reference of the functions but an explanation of them.

---

- The function **runWithContext** receives two arguments: `fields` (an object) and `callback` (a zero-argument function).

  It will create a new context

- The function **getFields**

```ts
function hello() {
  // "a" will have a different value depending on where is called from
  const a = getFields();
}

runWithSkogContext({ id: 3 }, () => {
  // When called from here, "a" will have the value "{ id: 3 }"
  hello();
});

// When you call the function `hello` from here (outside `runWithSkogContext`)
// "a" will NOT be "{ id: 3 }"
hello();
```

# In depth
