import consoleLog from "skog-core";
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
export default instance;
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
