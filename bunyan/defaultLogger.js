let alertShown = false

function showAlertOnce () {
  if (!alertShown) {
    console.warn('skog: You cannot log anything without calling "skog.createLogger" before. All the following logs will be hidden.')
    alertShown = true
  }
}

module.exports = {
  fatal () { showAlertOnce() },
  error () { showAlertOnce() },
  warn () { showAlertOnce() },
  info () { showAlertOnce() },
  debug () { showAlertOnce() },
  trace () { showAlertOnce() },
  child () {}
}
