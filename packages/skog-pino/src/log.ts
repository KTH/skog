import { Logger as SkogLogger, getFields, Levels } from "skog-core";
import pino, {
  LoggerOptions as PinoLoggerOptions,
  DestinationStream,
  Logger as PinoLogger,
} from "pino";

let instance: PinoLogger;

export function initializeLogger(
  optionsOrStream?: PinoLoggerOptions | DestinationStream
): void;
export function initializeLogger(
  options: PinoLoggerOptions,
  stream: DestinationStream
): void;
export function initializeLogger(
  optionsOrStream?: PinoLoggerOptions | DestinationStream,
  stream?: DestinationStream
) {
  if (!stream) {
    instance = pino(optionsOrStream);
  } else {
    instance = pino(optionsOrStream as PinoLoggerOptions, stream);
  }
}

function print(level: Levels, arg1: string | Error | any, arg2: unknown) {
  if (!instance) {
    throw new Error(
      "It is not possible to log stuff before instantiating. Use `initializeLogger` first"
    );
  }
  const fields = getFields();
  const loggerFunction = instance[level].bind(instance);

  if (fields) {
    if (typeof arg1 === "string") {
      loggerFunction(fields, arg1);
    } else if (typeof arg2 === "string") {
      if (arg1 instanceof Error) {
        loggerFunction({ ...fields, err: arg1 }, arg2);
      } else {
        loggerFunction({ ...fields, ...arg1 }, arg2);
      }
    }
  } else {
    if (typeof arg1 === "string") {
      loggerFunction(arg1);
    } else if (typeof arg2 === "string") {
      if (arg1 instanceof Error) {
        loggerFunction({ err: arg1 }, arg2);
      } else {
        loggerFunction(arg1, arg2);
      }
    }
  }
}

export { SkogLogger as Logger };
export const log: SkogLogger = {
  trace: (arg1, arg2?) => print("trace", arg1, arg2),
  debug: (arg1, arg2?) => print("debug", arg1, arg2),
  info: (arg1, arg2?) => print("info", arg1, arg2),
  warn: (arg1, arg2?) => print("warn", arg1, arg2),
  error: (arg1, arg2?) => print("error", arg1, arg2),
  fatal: (arg1, arg2?) => print("fatal", arg1, arg2),
};