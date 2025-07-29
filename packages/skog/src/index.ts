import consoleLog, { Levels, Logger } from "skog-core";
import pinoLog, {
  initializeLogger as initializePinoLogger,
  PinoLoggerOptions,
} from "skog-pino";
import { stdSerializers, stdTimeFunctions } from "pino";

let instance = consoleLog;

export function initializeLogger(options: PinoLoggerOptions = {}) {
  initializePinoLogger({
    level: process.env.NODE_ENV === "development" ? "trace" : "info",
    timestamp: stdTimeFunctions.isoTime,
    serializers: stdSerializers,
    ...options,
  });
  instance = pinoLog;
}

function logFn(level: Levels, arg1: Error | string | object, arg2?: unknown) {
  const fn = instance[level];

  if (typeof arg1 === "string") {
    fn(arg1);
    // What's the purpose of this if clause? If arg2 is undefined, the fn is called with (arg1,undefined). Which is the same as the above, isn't it?
  } else if (typeof arg2 === "undefined" || typeof arg2 === "string") {
    fn(arg1, arg2);
  }
  // When is neither of the above if clauses truthy, and why shouldn't this function log anything then? Is this a bug or on purpose?
}

const logger: Logger = {
  trace: (arg1, arg2?) => logFn("trace", arg1, arg2),
  debug: (arg1, arg2?) => logFn("debug", arg1, arg2),
  info: (arg1, arg2?) => logFn("info", arg1, arg2),
  warn: (arg1, arg2?) => logFn("warn", arg1, arg2),
  error: (arg1, arg2?) => logFn("error", arg1, arg2),
  fatal: (arg1, arg2?) => logFn("fatal", arg1, arg2),
};

export default logger;
export {
  addSkogContext,
  getFields,
  setFields,
  Levels,
  LogFunction,
  Logger,
  LEVEL_NUMBERS,
  runWithSkog,
  skogMiddleware,
} from "skog-core";
