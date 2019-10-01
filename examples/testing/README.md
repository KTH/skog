# Example on Skog with testing

When executing tests, specially in CI environments, it is useful to **mute**
the logger or have some simple `console` logger.

Run the examples with the right testing libraries:

```sh
npx ava ava.js --verbose # or `npm test:ava`
npx mocha mocha.js# or `npm test:mocha`
```
