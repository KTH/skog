// @ts-check
/**
 * In this example we are showing the main functionality of Skog
 */
import { addSkogContext, getFields, setFields } from "../dist/index.js";

// Implement sleep for convinience:
function sleep(t) {
  return new Promise((accept) => {
    setTimeout(accept, t);
  });
}

// We declare a function that will read the values
function printCurrentId(prefix = "") {
  // We get the stored fields in the current context
  const { id } = getFields();

  console.log(`${prefix} > ID is ${id}`);
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
  printCurrentId("IN");
  await sleep(Math.random() * 1000);
  printCurrentId("OUT");
}

// To be able to use Async Contexts, functions that call "getFields" and
// "setFields" must be "skogified". It can be done globally
const handle = addSkogContext(_handle);

// Optional. We initialize the id:
setFields({ id: 0 });

// We run `handle` 10 times in parallel:
Promise.all(Array.from({ length: 10 }).map(() => handle()));
