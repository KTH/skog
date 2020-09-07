import Logger from "bunyan"

declare interface LogFunction {
  (msg: string, ...interpolationValues: any[]): void;
  (obj: object, msg?: string, ...interpolationValues: any[]): void;
}

declare interface Logger {
  trace: LogFunction,
  debug: LogFunction,
  info: LogFunction,
  warn: LogFunction,
  error: LogFunction,
  fatal: LogFunction,
  logger: Logger,
  child<T>(extra: object, callback: () => T): T
};

declare const defaultLogger: Logger;

export default defaultLogger;
