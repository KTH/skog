import bunyan from "bunyan"
import skog from "skog"

module.exports = {
  createLogger (options) {
    skog.logger = bunyan.createLogger(options)
  }
}
