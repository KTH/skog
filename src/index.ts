// eslint-disable no-unused-vars @typescript-eslint/no-explicit-any
import { createNamespace } from "cls-hooked";
import cuid from "cuid";
// eslint-disable-next-line import/no-unresolved
import { NextFunction, Request } from "express";
import pino, { LoggerOptions, LogFn, Bindings, DestinationStream } from "pino";

/** A logger with 6 levels */
interface Logger {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  fatal: LogFn;
}

type LogFnArguments = Parameters<LogFn>;

/** A logger that can have "child" loggers */
interface ExtendableLogger extends Logger {
  child(options: Bindings): Logger;
}

// This is the object exposed as API of "skog".
interface Skog extends Logger {
  logger: ExtendableLogger;
  child<T>(options: Bindings, callback: () => T): T;
}

// Default logger. If "init" is not called, default logger is just `console`
// This prevents apps to crash when logger is not initialized, for example
// during tests
const defaultLogger: ExtendableLogger = {
  trace(...args: LogFnArguments) {
    console.log(...args);
  },
  debug(...args: LogFnArguments) {
    console.log(...args);
  },
  info(...args: LogFnArguments) {
    console.log(...args);
  },
  warn(...args: LogFnArguments) {
    console.log(...args);
  },
  error(...args: LogFnArguments) {
    console.log(...args);
  },
  fatal(...args: LogFnArguments) {
    console.log(...args);
  },
  child() {
    return defaultLogger;
  },
};

const namespace = createNamespace("skog");

function getCurrentLogger(): ExtendableLogger {
  return namespace.get("logger") ?? defaultLogger;
}

function setCurrentLogger(newLogger: ExtendableLogger) {
  const ref: ExtendableLogger = namespace.get("logger") ?? defaultLogger;

  ref.trace = newLogger.trace.bind(newLogger);
  ref.debug = newLogger.debug.bind(newLogger);
  ref.info = newLogger.info.bind(newLogger);
  ref.warn = newLogger.warn.bind(newLogger);
  ref.error = newLogger.error.bind(newLogger);
  ref.fatal = newLogger.fatal.bind(newLogger);
  ref.child = newLogger.child.bind(newLogger);
}

const skog: Skog = {
  trace(...args: LogFnArguments) {
    getCurrentLogger().trace(...args);
  },

  debug(...args: LogFnArguments) {
    getCurrentLogger().debug(...args);
  },

  info(...args: LogFnArguments) {
    getCurrentLogger().info(...args);
  },

  warn(...args: LogFnArguments) {
    getCurrentLogger().warn(...args);
  },

  error(...args: LogFnArguments) {
    getCurrentLogger().error(...args);
  },

  fatal(...args: LogFnArguments) {
    getCurrentLogger().fatal(...args);
  },

  child<T>(options: Bindings, callback: () => T): T {
    return namespace.runAndReturn(() => {
      namespace.set("logger", getCurrentLogger().child(options));
      return callback();
    });
  },

  set logger(newLogger: ExtendableLogger) {
    setCurrentLogger(newLogger);
  },

  get logger() {
    return getCurrentLogger();
  },
};

/**
 * Initialize the Skog logger with Pino
 *
 * @param fields An object with fields like `app` that will be included in logs
 * @param options Options for Pino
 */
export function initializeLogger(
  fields: Bindings = {},
  options?: LoggerOptions | DestinationStream
): void {
  const pinoLogger = pino(options).child(fields);
  setCurrentLogger(pinoLogger);
}

export function skogMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  skog.child({ req_id: cuid() }, next);
}

export default skog;
