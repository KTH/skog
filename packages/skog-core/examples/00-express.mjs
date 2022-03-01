/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
/**
 * This example shows how to use Skog with express
 *
 * Run this script directly to perform several parallel requests to a Express
 * server
 */
import express from "express";
import http from "http";
import { skogMiddleware, consoleLog as log } from "../dist/index.js";

// Helper function
function sleep(t) {
  return new Promise((accept) => {
    setTimeout(accept, t);
  });
}

// This function will log "req_id" if available.
// See how we are NOT passing "req_id" anywhere
function greet(name) {
  log.info(`Hello ${name}`);
}

// Here we create the express server
const app = express();
app.use(skogMiddleware);
app.get("/", async (req, res) => {
  await sleep(Math.random() * 10);
  log.info("Received request");
  await sleep(Math.random() * 10);
  greet(req.query.name);
  res.send(req.query.name);
});

// With this function we are going to perform HTTP requests to our server
async function sendRequest(name) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000?name=${name}`, (res) => {
      resolve();
    });
  });
}

// Let's run our program!!
const server = app.listen(3000, () => {
  log.info("Starting server");
  greet("world");
});

// We perform a couple of parallel requests
const names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
await Promise.all(names.map((name) => sendRequest(name)));
server.close();
