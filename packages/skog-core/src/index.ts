/**
 * Convinience functions around Node.js AsyncLocalStorage
 *
 * Read more about AsyncLocalStorage: https://nodejs.org/api/async_context.html
 */
import { AsyncLocalStorage } from "async_hooks";
import cuid from "cuid";

const logDataStorage = new AsyncLocalStorage<{ fields: Record<string, any> }>();
let rootFields = {};

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
 * Express middleware that adds a field called "req_id" into the current
 * context
 */
export function skogMiddleware(req: unknown, res: unknown, next: () => void) {
  skogify(() => {
    setFields({ ...getFields(), req_id: cuid() });
    next();
  })();
}
