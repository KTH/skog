<div align="center">
<img src="media/logo.png" width="360">
<p>
Logging with context for Node.js
</p>
</div>


[![Build Status](https://travis-ci.org/KTH/skog.svg?branch=master)](https://travis-ci.org/KTH/skog)

Add context to your logs without adding parameters to your code.

Your logs with context (the `req_id` parameter):

```
{"name":"example-app","req_id":3,"msg":"Getting user..."}
{"name":"example-app","req_id":2,"msg":"Getting user..."}
{"name":"example-app","req_id":6,"msg":"Getting user..."}
{"name":"example-app","req_id":3,"msg":"Got the user!"}
{"name":"example-app","req_id":4,"msg":"Getting user..."}
{"name":"example-app","req_id":2,"msg":"Got the user!"}
{"name":"example-app","req_id":4,"msg":"Got the user!"}
{"name":"example-app","req_id":1,"msg":"Getting user..."}
{"name":"example-app","req_id":6,"msg":"Got the user!"}
{"name":"example-app","req_id":9,"msg":"Getting user..."}
{"name":"example-app","req_id":7,"msg":"Getting user..."}
{"name":"example-app","req_id":1,"msg":"Got the user!"}
{"name":"example-app","req_id":5,"msg":"Getting user..."}
{"name":"example-app","req_id":9,"msg":"Got the user!"}
{"name":"example-app","req_id":8,"msg":"Getting user..."}
{"name":"example-app","req_id":7,"msg":"Got the user!"}
{"name":"example-app","req_id":5,"msg":"Got the user!"}
{"name":"example-app","req_id":8,"msg":"Got the user!"}
{"name":"example-app","req_id":10,"msg":"Getting user..."}
{"name":"example-app","req_id":10,"msg":"Got the user!"}
```


Your code (no `req_id` anywhere)

```js
async function getUser () {
  skog.info('Getting user...')
  await sleep(Math.random() * 10)
  skog.info('Got the user!')
}
```

## Features

- **Opinionated and familiar API**. Use *only* these conventional functions for logging: `fatal`, `error`, `warn`, `info`, `debug` and `trace`.
- **Lightweight**. [Less than 300 kB](https://packagephobia.now.sh/result?p=skog) mainly because Skog doesn't come with any logging library.
- **Flexible**. We offer [functions specifically made for Bunyan](/examples/server/bunyan.js) out of the box, but you can use Skog with [**any** logger library](/examples/server/pino.js).

- [Start using `skog`](./docs/01-tutorial-express.md)
- [Look for further documentation](./docs/README.md)
