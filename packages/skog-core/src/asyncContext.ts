/**
 * Convinience functions around Node.js AsyncLocalStorage
 *
 * Read more about AsyncLocalStorage: https://nodejs.org/api/async_context.html
 */
import { AsyncLocalStorage } from "async_hooks";
import { nanoid as uid } from "nanoid";

type Fields = Record<string, any> | null;

const logDataStorage = new AsyncLocalStorage<{ fields: Fields }>();
let rootFields: Fields = null;

/**
 * Get the fields in the current async context.
 *
 * WARNING! It is usually a very bad idea to get data from the context for lots
 * of reasons:
 *
 * - There is no guarantee about what will be returned by this function. It can
 *   be null, undefined or any other value.
 * - Therefore, you should treat the returned value of this function as an
 *   opaque value. If you need to pass data, you can create your own Async
 *   Contexts in Node.js outside of Skog:
 *   https://nodejs.org/api/async_context.html
 */
export function getFields<T = Fields>() {
  return (logDataStorage.getStore()?.fields ?? rootFields) as T;
}

/**
 * Replace fields in the current Skog context.
 */
export function setFields<T = Fields>(newFields: T) {
  const store = logDataStorage.getStore();

  if (store) {
    store.fields = newFields;
  } else {
    rootFields = newFields;
  }
}

/**
 * Converts a function into a function with context. The returned function will
 * have the same signature as the argument.
 *
 * NOTE: in almost all cases, you should use `runWithSkog` instead of this
 * function.
 */
export function addSkogContext<Args extends any[], Ret extends unknown>(
  fn: (...args: Args) => Ret
): (...args: Args) => Ret {
  return (...args: Args) => {
    const currentFields = getFields();

    return logDataStorage.run({ fields: currentFields }, () => fn(...args));
  };
}

/**
 * Runs a given function `fn` such in a way that logs will include `fields`
 *
 * @returns whatever is returned by the function `fn`, including promises
 *
 * You can use this function to create custom middleware for your application
 */
export function runWithSkog<T>(fields: Fields, fn: () => T): T {
  return addSkogContext(() => {
    setFields(fields);

    return fn();
  })();
}

/**
 * Express middleware that adds a field called "req_id" to all logs.
 */
export function skogMiddleware(req: unknown, res: unknown, next: () => void) {
  runWithSkog({ ...getFields(), req_id: uid() }, next);
}
