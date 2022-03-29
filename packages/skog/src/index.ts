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
  } else if (typeof arg2 === "undefined" || typeof arg2 === "string") {
    fn(arg1, arg2);
  }
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
  runWithSkogContext,
  skogMiddleware,
} from "skog-core";
