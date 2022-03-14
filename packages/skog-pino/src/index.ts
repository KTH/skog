import {
  Logger as SkogLogger,
  getFields,
  Levels,
  LogFunction,
} from "skog-core";
import pino, {
  LoggerOptions,
  DestinationStream,
  Logger as PinoLogger,
} from "pino";

let instance: PinoLogger;

export function initializeLogger(
  optionsOrStream?: LoggerOptions | DestinationStream
): void;
export function initializeLogger(
  options: LoggerOptions,
  stream: DestinationStream
): void;
export function initializeLogger(
  optionsOrStream?: LoggerOptions | DestinationStream,
  stream?: DestinationStream
) {
  if (!stream) {
    // optionsOrStream is "LoggerOptions"
    instance = pino(optionsOrStream);
  } else {
    instance = pino(optionsOrStream as LoggerOptions, stream);
  }
}

function print(level: Levels, arg1: string | Error | any, arg2: unknown) {
  const fields = getFields();
  const loggerFunction = instance[level].bind(instance);

  if (fields) {
    //...
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

// const log: Logger = {
//   debug(arg1, arg2) {},
// };
