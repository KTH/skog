const { createNamespace } = require('cls-hooked')
const ns = createNamespace('skog')

function noop () {}

const defaultLogger = {
  trace: (...args) => process.env.NODE_ENV === 'test' ? noop : console.log(...args),
  debug: (...args) => process.env.NODE_ENV === 'test' ? noop : console.debug(...args),
  info: (...args) => process.env.NODE_ENV === 'test' ? noop : console.info(...args),
  warn: (...args) => process.env.NODE_ENV === 'test' ? noop : console.warn(...args),
  error: (...args) => process.env.NODE_ENV === 'test' ? noop : console.error(...args),
  fatal: (...args) => process.env.NODE_ENV === 'test' ? noop : console.error(...args),
  child: noop
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
