import { log, Logger, initializeLogger } from "./log";

export {
  LEVEL_NUMBERS,
  Levels,
  LogFunction,
  addSkogContext,
  getFields,
  setFields,
  runWithSkogContext,
  skogMiddleware,
} from "skog-core";
export { initializeLogger, Logger };
export default log;
