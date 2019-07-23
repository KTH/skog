const bunyan = require('bunyan')
const { createNamespace } = require('cls-hooked')
const ns = createNamespace('skog/bunyan')

let log

function getCurrentLogger () {
  return ns.get('logger') || log
}

module.exports = {
  createLogger (options) {
    log = bunyan.createLogger(options)
  },

  child (options, callback) {
    ns.run(() => {
      ns.set('logger', getCurrentLogger().child(options))
      callback()
    })
  },

  trace: (...args) => getCurrentLogger().trace(...args),
  debug: (...args) => getCurrentLogger().debug(...args),
  info: (...args) => getCurrentLogger().info(...args),
  warn: (...args) => getCurrentLogger().warn(...args),
  error: (...args) => getCurrentLogger().error(...args),
  fatal: (...args) => getCurrentLogger().fatal(...args)
}
