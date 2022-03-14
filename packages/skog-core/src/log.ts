import { getFields } from "./asyncContext";

export const LEVEL_NUMBERS = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

export type Levels = keyof typeof LEVEL_NUMBERS;

export interface LogFunction {
  (arg1: Error | Record<string, any>, message: string): void;

  (message: string): void;
}

export interface Logger {
  fatal: LogFunction;
  error: LogFunction;
  warn: LogFunction;
  info: LogFunction;
  debug: LogFunction;
  trace: LogFunction;
}

function print(level: Levels, arg1: string | Error | any, arg2?: unknown) {
  const fields = getFields();

  if (fields) {
    if (typeof arg1 === "string") {
      console.log("[%s] %s %o", level, arg1, fields);
    } else if (typeof arg2 === "string") {
      console.log("[%s] %s %o", level, arg2, { ...fields, ...arg1 });
    }
  } else {
    if (typeof arg1 === "string") {
      console.log("[%s] %s", level, arg1);
    } else if (typeof arg2 === "string") {
      console.log("[%s] %s %o", level, arg2, arg1);
    }
  }
}

export const consoleLog: Logger = {
  fatal: (arg1, arg2?) => print("fatal", arg1, arg2),
  error: (arg1, arg2?) => print("error", arg1, arg2),
  warn: (arg1, arg2?) => print("warn", arg1, arg2),
  info: (arg1, arg2?) => print("info", arg1, arg2),
  debug: (arg1, arg2?) => print("debug", arg1, arg2),
  trace: (arg1, arg2?) => print("trace", arg1, arg2),
};
