# Server example with Skog

Example implementing a fake server and fake parallel requests to show how Skog is keeping data between functions, even when they are in different modules.

The "magic" here is that `server.js` is the one that actually log messages with a field called `req_id` but the field is not set inside that function.

- `server.js` is the actual fake server. It is a simplified implementation of a server that needs to read data from a database (a typical "long task").
- `pino.js`, `bunyan.js` and `custom.js` are the starting point of the app. They initialize the logger and simulate requests to the server.

To run the examples:

```sh
npm install
node bunyan.js # or `node pino.js` or `node custom.js`
```
