/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
/**
 * This example shows how to use Skog with express
 */
import express from "express";
import http from "http";
import { skogMiddleware, consoleLog as log } from "../dist/index.js";

function sleep(t) {
  return new Promise((accept) => {
    setTimeout(accept, t);
  });
}

function greet(name) {
  log.info(`Hello ${name}`);
}

const app = express();
app.use(skogMiddleware);
app.get("/", async (req, res) => {
  await sleep(Math.random() * 10);
  log.info("Received request");
  await sleep(Math.random() * 10);
  greet(req.query.name);
  res.send(req.query.name);
});

const server = http.createServer(app);

async function sendRequest(name) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000?name=${name}`, (res) => {
      log.info(`Response: ${res.statusCode}`);
      resolve();
    });
  });
}

server.listen(3000, () => {
  log.info("Starting server");
  greet("world");
});
const names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
await Promise.all(names.map((name) => sendRequest(name)));
server.close();
