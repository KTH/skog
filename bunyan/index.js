const bunyan = require('bunyan')
const skog = require('../')

module.exports = {
  createLogger (options) {
    skog.logger = bunyan.createLogger(options)
  }
}
