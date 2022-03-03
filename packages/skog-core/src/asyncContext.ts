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
 */
export function getFields() {
  return logDataStorage.getStore()?.fields ?? rootFields;
}

/**
 * Replace fields in the current async context.
 */
export function setFields(newFields: Record<string, any>) {
  const store = logDataStorage.getStore();

  if (store) {
    store.fields = newFields;
  } else {
    rootFields = newFields;
  }
}

/**
 * Converts a function into a function with new context.
 *
 * The returned function will have the same signature as the argument
 */
export function skogify<Args extends any[], Ret extends unknown>(
  fn: (...args: Args) => Ret
): (...args: Args) => Ret {
  return (...args: Args) => {
    const currentFields = getFields();

    return logDataStorage.run({ fields: currentFields }, () => fn(...args));
  };
}

/**
 * Runs a given function `fn` with a new context that includes given `fields`
 *
 * Returns whatever is returned by the function.
 */
export function runWithContext<T>(fields: Record<string, any>, fn: () => T): T {
  return skogify(() => {
    setFields(fields);

    return fn();
  })();
}

/**
 * Express middleware that adds a field called "req_id" into the current
 * context
 */
export function skogMiddleware(req: unknown, res: unknown, next: () => void) {
  runWithContext({ ...getFields(), req_id: uid() }, next);
}
