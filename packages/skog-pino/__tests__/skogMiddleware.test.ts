import log, { skogMiddleware, initializeLogger } from "../src/index";
import express from "express";
import { setTimeout } from "timers/promises";
import http from "http";

// Define a HTTP server and client
const app = express();
app.use(skogMiddleware);
app.get("/", async (req, res) => {
  for (let i = 0; i < 10; i++) {
    await setTimeout(Math.random() * 100);
    log.info(`${req.query.name} - Hello`);
  }

  res.send(req.query.name);
});

async function sendRequest(name: string) {
  return new Promise<void>((resolve) => {
    http.get(`http://localhost:3001?name=${name}`, (res) => {
      resolve();
    });
  });
}

describe("skogMiddleware", () => {
  let server: http.Server;
  let result: string[] = [];

  beforeAll(() => {
    server = app.listen(3001);
    jest.useFakeTimers("modern").setSystemTime(new Date(1234));
  });

  beforeEach(() => {
    result = [];
    initializeLogger(
      {},
      {
        write(msg) {
          result.push(msg);
        },
      }
    );
  });

  test("Ensure that `console.log` is called 10 times with the same arguments", async () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    await Promise.all(names.map((name) => sendRequest(name)));

    // Ensure all calls that contain "A - Hello" have the same content
    const logsA = result.filter((r) => r.includes("A - Hello"));
    expect(logsA.filter((l) => l === logsA[0])).toEqual(logsA);
  });

  afterAll(() => {
    server.close();
  });
});
