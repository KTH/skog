const cuid = require("cuid");
const skog = require("..");
const { trace, debug, info, warn, error, fatal, child } = require("./logger");
const init = {
  pino(options) {
    skog.logger = require("pino")(options);
  },
  bunyan(options) {
    skog.logger = require("bunyan").createLogger(options);
  },
};

function middleware(req, res, next) {
  child({ req_id: cuid() }, next);
}

module.exports = {
  init,
  middleware,

  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  child,
};
