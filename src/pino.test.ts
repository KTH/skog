import pino from "pino";
import os from "os";
import fs from "fs";
import path from "path";
import log, { initializeLogger } from "./index";

test("`skog` uses `pino` if initialized", async () => {
  // We mock "current date" to have consistent tests
  Date.now = jest.fn(() => 1487076708000);

  const dir = fs.mkdtempSync(os.tmpdir());
  const p = path.resolve(dir, "something.txt");
  initializeLogger(
    { app: "test-app" },
    // We pass this parameter to avoid including "host" and "pid" in logs
    // in order to have consistent tests
    { base: undefined },
    pino.destination(p)
  );

  log.info("Hello");

  expect(fs.readFileSync(p, { encoding: "utf-8" })).toMatchInlineSnapshot(`
    "{\\"level\\":30,\\"time\\":1487076708000,\\"app\\":\\"test-app\\",\\"msg\\":\\"Hello\\"}
    "
  `);
});
