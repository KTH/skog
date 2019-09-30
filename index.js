const { createNamespace } = require('cls-hooked')
const ns = createNamespace('skog')

const defaultLogger = {
  trace: (...args) => console.trace(...args),
  debug: (...args) => console.debug(...args),
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  fatal: (...args) => console.error(...args),
  child: () => {}
}

function getCurrentLogger () {
  return ns.get('logger') || defaultLogger
}

function setCurrentLogger (logger) {
  const ref = ns.get('logger') || defaultLogger

  ;['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'child'].forEach(prop => {
    ref[prop] = (logger[prop] && logger[prop].bind(logger)) || ref[prop]
  })
}

module.exports = {
  child (options, callback) {
    return ns.runAndReturn(async () => {
      ns.set('logger', getCurrentLogger().child(options))
      return callback()
    })
  },

  get logger () {
    return getCurrentLogger()
  },

  set logger (newLogger) {
    return setCurrentLogger(newLogger)
  },

  trace: (...args) => getCurrentLogger().trace(...args),
  debug: (...args) => getCurrentLogger().debug(...args),
  info: (...args) => getCurrentLogger().info(...args),
  warn: (...args) => getCurrentLogger().warn(...args),
  error: (...args) => getCurrentLogger().error(...args),
  fatal: (...args) => getCurrentLogger().fatal(...args)
}
