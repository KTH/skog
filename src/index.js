const cuid = require("cuid");
const logger = require("./logger");
const init = {
  pino(fields = {}, options = {}) {
    logger.setLogger(require("pino")(options).child(fields));
  },
  bunyan(options) {
    logger.setLogger(require("bunyan").createLogger(options));
  },
};

function middleware(req, res, next) {
  logger.child({ req_id: cuid() }, next);
}

module.exports = {
  init,
  middleware,

  trace: logger.trace,
  debug: logger.debug,
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
  fatal: logger.fatal,
  child: logger.child,
};
