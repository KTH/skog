import log, { skogMiddleware } from "../src/index";
import express from "express";
import { setTimeout } from "timers/promises";
import http from "http";
import { format } from "util";
import { runWithSkogContext } from "../src/asyncContext";

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
    http.get(`http://localhost:3000?name=${name}`, (res) => {
      resolve();
    });
  });
}

describe("skogMiddleware", () => {
  let server: http.Server;

  beforeAll(() => {
    server = app.listen(3000);
  });

  test("Ensure that `console.log` is called 10 times with the same arguments", async () => {
    const result: string[] = [];

    // Mock console.log to send the logs to the "result" array
    jest.spyOn(console, "log").mockImplementation((...args) => {
      result.push(format(...args));
    });

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

describe("log", () => {
  test("Ensure log methods renders Error objects correctly", () => {
    // Mock console.log to send the logs to the "result" array
    const result: string[] = [];

    // Mock console.log to send the logs to the "result" array
    jest.spyOn(console, "log").mockImplementation((...args) => {
      result.push(format(...args));
    });

    try {
      throw new Error("Example error");
    } catch (err) {
      if (err instanceof Error) {
        log.info(err);
        log.info(err, "Custom message");
      }
    }

    expect(result.length).toBe(2);
    expect(result[0]).toMatchSnapshot();
    expect(result[1]).toMatchSnapshot();
  });

  test("Ensure log methods renders Error objects within a context", () => {
    // Mock console.log to send the logs to the "result" array
    const result: string[] = [];

    // Mock console.log to send the logs to the "result" array
    jest.spyOn(console, "log").mockImplementation((...args) => {
      result.push(format(...args));
    });

    runWithSkogContext({ id: 1 }, () => {
      try {
        throw new Error("Example error");
      } catch (err) {
        if (err instanceof Error) {
          log.info(err);
          log.info(err, "Custom message");
        }
      }
    });

    expect(result.length).toBe(2);
    expect(result[0]).toMatchSnapshot();
    expect(result[1]).toMatchSnapshot();
  });
});
