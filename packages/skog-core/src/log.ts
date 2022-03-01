import { getFields } from "./asyncContext";

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

function print(
  level: "FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE",
  arg1: string | Error | any,
  arg2?: unknown
) {
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
  fatal: (arg1, arg2?) => print("FATAL", arg1, arg2),
  error: (arg1, arg2?) => print("ERROR", arg1, arg2),
  warn: (arg1, arg2?) => print("WARN", arg1, arg2),
  info: (arg1, arg2?) => print("INFO", arg1, arg2),
  debug: (arg1, arg2?) => print("DEBUG", arg1, arg2),
  trace: (arg1, arg2?) => print("TRACE", arg1, arg2),
};
