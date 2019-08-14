[![Build Status](https://travis-ci.org/KTH/skog.svg?branch=master)](https://travis-ci.org/KTH/skog)

# Skog

Skog is a **singleton logging library for Node.js** that outputs like Bunyan.

```js
const log = require('skog/bunyan');
log.createLogger({name: "myapp"});
log.info("hi");
```

# Installation

Install bunyan + skog (in a future, more libraries than Bunyan will be supported)

```
npm i bunyan skog
```

# An oxymoron solved: "context-aware global"

With Skog is it possible to create once a logger (including children) and use it **without** passing the `log` object around.

```js
// index.js
const log = require('skog/bunyan')
const dog = require('./dog')
const cat = require('./cat')

// Create once
log.createLogger({name: 'myapp'})

dog.bark()
cat.callDog()
```

```js
// dog.js
const log = require('skog/bunyan')

module.exports = {
  bark () {
    log.info('Wow!')
  }
}
```

```js
// cat.js
const log = require('skog/bunyan')
const dog = require('./dog')

module.exports = {
  callDog () {
    log.child({ called_by: 'cat' }, () => {
      // Don't need to pass "called_by" to the "dog" object
      dog.bark()
    })
  }
}
```
