import { createNamespace } from "cls-hooked";
import cuid from "cuid";
import { NextFunction, Request } from "express";
import pino, { LoggerOptions } from "pino";

interface ObjectWithoutMsg {
  msg: never;
}

/** Emits bunyan-formatted logs */
interface LogFunction {
  (msg: string, ...args: any[]): void;
  (obj: any): void;
  (obj: ObjectWithoutMsg, msg?: string, ...args: any[]): void;
  (err: Error, msg?: string, ...args: any[]): void;
}

/** A logger with 6 levels */
interface Logger {
  trace: LogFunction;
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
  fatal: LogFunction;
}

/** A logger that can have "child" loggers */
interface ExtendableLogger extends Logger {
  child(options: any): Logger;
}

// This is the object exposed as API of "skog".
interface Skog extends Logger {
  logger: ExtendableLogger;
  child<T>(options: any, callback: () => T): T;
}

// Default logger. If "init" is not called, default logger is just `console`
// This prevents apps to crash when logger is not initialized, for example
// during tests
const defaultLogger: ExtendableLogger = {
  trace(...args: any[]) {
    console.log(...args);
  },
  debug(...args: any[]) {
    console.log(...args);
  },
  info(...args: any[]) {
    console.log(...args);
  },
  warn(...args: any[]) {
    console.log(...args);
  },
  error(...args: any[]) {
    console.log(...args);
  },
  fatal(...args: any[]) {
    console.log(...args);
  },
  child(options: any) {
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
  trace(...args) {
    getCurrentLogger().trace(...args);
  },

  debug(...args) {
    getCurrentLogger().debug(...args);
  },

  info(...args) {
    getCurrentLogger().info(...args);
  },

  warn(...args) {
    getCurrentLogger().warn(...args);
  },

  error(...args) {
    getCurrentLogger().error(...args);
  },

  fatal(...args) {
    getCurrentLogger().fatal(...args);
  },

  child<T = any>(options: any, callback: () => T): T {
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
export function initializeLogger(fields?: any, options?: LoggerOptions) {
  const pinoLogger = pino(options).child(fields);
  setCurrentLogger(pinoLogger);
}

export function skogMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  skog.child({ req_id: cuid() }, next);
}

export default skog;
