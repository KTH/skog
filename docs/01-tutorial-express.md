# Getting started. Use Skog with Bunyan and Express

In this tutorial you are going to:

- Create a simple HTTP server with Express
- Use Bunyan to write logs
- Use Skog in order to ensure that Bunyan logs the `req_id` (request ID) **without passing that ID**.

## Step 1. Initialize the project. Install `bunyan`, `express` and `skog`

Create a new directory. Inside that directory run `npm init -y` to start a new NPM project

```
mkdir skog-tutorial
cd skog-tutorial
npm init -y
```

Run `npm` to install `express`, `skog` and `bunyan`. Remember that `skog` doesn't install any logging library for you

```
npm i skog bunyan express
```

## Step 2. Create the server

Create a file called `index.js` with the following code.

```js
const express = require('express')
const app = express()

async function longTask () {
  console.info('This is a long task')
  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  })
  console.info('Returning...')
  return Math.random()
}

app.get('/', async (req, res) => {
  console.info('Request is here')
  const number = await longTask()
  console.info(`Number is ${number}`)
  res.send(`Hi! Your number is ${number}`)
})

app.listen(3000, () => {
  console.info('Starting in port 3000')
})
```

## Step 3. Test the server

Start the server with

```
node .
```

Then go to http://localhost:3000 with your browser. You should see `Hi! Your number is 0.288183794` 5 seconds later (the number might be different).

Look also at the logs. You should see something like this:

```
Starting in port 3000
Request is here
This is a long task
Returning...
Number is 0.40687947244059
```

Now, open `http://localhost:3000` in **two different browser tabs at the same time**. The idea here is to make the second request before the first has finished. The logs should look like this:

```
Request is here
This is a long task
Request is here
This is a long task
Returning...
Number is 0.2511496324838238
Returning...
Number is 0.5350994446497188
```

## Step 4. Add `bunyan`

Add the following lines after `app = express()`

```js
const log = require('bunyan').createLogger({
  name: 'skog-example-express',
})
```

Replace all `console.info` with `log.info`.

Your file `index.js` should look something like this.

```js
const express = require('express')
const app = express()
const log = require('bunyan').createLogger({
  name: 'skog-example-express',
})

async function longTask () {
  log.info('This is a long task')
  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  })
  log.info('Returning...')
  return Math.random()
}

app.get('/', async (req, res) => {
  log.info('Request is here')
  const number = await longTask()
  log.info(`Number is ${number}`)
  res.send(`Hi! Your number is ${number}`)
})

app.listen(3000, () => {
  log.info('Starting in port 3000')
})
```

Now start the app with the following command

```
node . | npx bunyan -o short
```

Now, open `http://localhost:3000` in **two different browser tabs at the same time** as before. The idea here is to make the second request before the first has finished. The logs should look like this:

```
07:26:48.839Z  INFO skog-example-express: Starting in port 3000
07:27:15.585Z  INFO skog-example-express: Request is here
07:27:15.586Z  INFO skog-example-express: This is a long task
07:27:16.270Z  INFO skog-example-express: Request is here
07:27:16.270Z  INFO skog-example-express: This is a long task
07:27:20.590Z  INFO skog-example-express: Returning...
07:27:20.590Z  INFO skog-example-express: Number is 0.4847419833124249
07:27:21.272Z  INFO skog-example-express: Returning...
07:27:21.272Z  INFO skog-example-express: Number is 0.8558146028735152
```

## Step 5. Create a Bunyan child log

Replace the block that starts with `app.get` with something like this:

```js
app.get('/', async (req, res) => {
  const log2 = log.child({
    req_id: Math.floor(Math.random() * 1000)
  })
  log2.info('Request is here')
  const number = await longTask()
  log2.info(`Number is ${number}`)
  res.send(`Hi! Your number is ${number}`)
})
```

Start the app with the following command again

```
node . | npx bunyan -o short
```

Now, open `http://localhost:3000` in **two different browser tabs at the same time** as before. The idea here is to make the second request before the first has finished. The logs should look like this.

```
08:18:00.395Z  INFO skog-example-express: Starting in port 3000
08:18:01.648Z  INFO skog-example-express: Request is here (req_id=497)
08:18:01.648Z  INFO skog-example-express: This is a long task
08:18:02.486Z  INFO skog-example-express: Request is here (req_id=733)
08:18:02.486Z  INFO skog-example-express: This is a long task
08:18:06.651Z  INFO skog-example-express: Returning...
08:18:06.651Z  INFO skog-example-express: Number is 0.2216711026667728 (req_id=497)
08:18:07.490Z  INFO skog-example-express: Returning...
08:18:07.491Z  INFO skog-example-express: Number is 0.21387668963599427 (req_id=733)
```

---

## Recap until here

Until this point, we have added `req_id` as a variable to be able to correlate different logs (For example, just by looking there you can see which "Request is here" and "Number is..." come from the same request)

We are going to use `skog` to add the same `req_id` information to the other log lines

---

## Step 6. Change the way to initialize

Replace the first lines of `index.js` with the following content:

```js
const express = require('express')
const app = express()
const log = require('skog')
require('skog/bunyan').createLogger({
  name: 'skog-example-express',
})
```

Then, change the `app.get` with this:

```js
app.get('/', async (req, res) => {
  log.child({ req_id: Math.floor(Math.random() * 1000) }, async () => {
    log.info('Request is here')
    const number = await longTask()
    log.info(`Number is ${number}`)
    res.send(`Hi! Your number is ${number}`)
  })
})
```

Now, `index.js` should look like this:

```js
const express = require('express')
const app = express()
const log = require('skog')
require('skog/bunyan').createLogger({
  name: 'skog-example-express',
})

async function longTask () {
  log.info('This is a long task')
  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  })
  log.info('Returning...')
  return Math.random()
}

app.get('/', async (req, res) => {
  log.child({ req_id: Math.floor(Math.random() * 1000) }, async () => {
    log.info('Request is here')
    const number = await longTask()
    log.info(`Number is ${number}`)
    res.send(`Hi! Your number is ${number}`)
  })
})

app.listen(3000, () => {
  log.info('Starting in port 3000')
})
```

Start the app with the following command again

```
node . | npx bunyan -o short
```

Now, open `http://localhost:3000` in **two different browser tabs at the same time** as before. The idea here is to make the second request before the first has finished. The logs should look like this.

```
08:24:42.383Z  INFO skog-example-express: Starting in port 3000
08:24:44.419Z  INFO skog-example-express: Request is here (req_id=654)
08:24:44.419Z  INFO skog-example-express: This is a long task (req_id=654)
08:24:45.790Z  INFO skog-example-express: Request is here (req_id=110)
08:24:45.790Z  INFO skog-example-express: This is a long task (req_id=110)
08:24:49.423Z  INFO skog-example-express: Returning... (req_id=654)
08:24:49.423Z  INFO skog-example-express: Number is 0.43164906904760314 (req_id=654)
08:24:50.794Z  INFO skog-example-express: Returning... (req_id=110)
08:24:50.795Z  INFO skog-example-express: Number is 0.5254621451659938 (req_id=110)
```

---

## Recap

Great! Now you have `req_id`  in all log lines so you can track and correlate all of them. See how **we haven't touched the `longTask` function at all**.

That is what `skog` offers.
