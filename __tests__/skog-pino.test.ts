import log, { initializeLogger, runWithSkog } from "../packages/skog-pino/src";
import { format } from "util";

let result: string[] = [];

function write(msg: string) {
  result.push(msg);
}

/**
 * This is the "reference" test for any skog-compatible library.
 *
 * In this reference test, we try to test all possible combinations of arguments
 * in order to make sure that all implementations handle things in a proper way.
 */
describe("skog with pino", () => {
  beforeAll(() => {
    initializeLogger({}, { write });
  });

  beforeEach(() => {
    result = [];

    jest.spyOn(console, "log").mockImplementation((...args) => {
      result.push(format(...args));
    });
  });

  describe("without context", () => {
    describe("with only one argument", () => {
      test("argument of type `Error`", () => {
        log.info(new Error("Some error"));
        expect(result.length).toBe(1);
        expect(result[0]).toContain('"stack":"Error: Some error');
      });
      test("argument of type `object`", () => {
        log.info({ id: 2 });
        expect(result[0]).toContain('"id":2');
      });
      test("argument of type `string`", () => {
        log.info("Hello world");
        expect(result[0]).toContain('"msg":"Hello world"');
      });
    });
    describe("with two arguments (second argument = string)", () => {
      test("first argument of type `Error`", () => {
        log.info(new Error("Some error"), "There is an error");
        expect(result[0]).toContain('"stack":"Error: Some error');
        expect(result[0]).toContain('"msg":"There is an error"');
      });
      test("first argument of type `object`", () => {
        log.info({ id: 2 }, "Hello world");
        expect(result[0]).toContain('"id":2');
      });
    });
  });

  describe("with context", () => {
    describe("with only one argument", () => {
      test("argument of type `Error`", () => {
        runWithSkog({ id: 1 }, () => {
          log.info(new Error("Some error"));
        });

        expect(result[0]).toContain('"id":1');
        expect(result[0]).toContain('"stack":"Error: Some error');
      });

      test("argument of type `object`", () => {
        runWithSkog({ id: 1 }, () => {
          log.info({ a: 3 });
        });

        expect(result[0]).toContain('"id":1');
        expect(result[0]).toContain('"a":3');
      });
      test("argument of type `string`", () => {
        runWithSkog({ id: 1 }, () => {
          log.info("Hello world");
        });

        expect(result[0]).toContain('"id":1');
        expect(result[0]).toContain("Hello world");
      });
    });

    describe("with two arguments (second argument = string)", () => {
      test("first argument of type `Error`", () => {
        runWithSkog({ id: 1 }, () => {
          log.info(new Error("Some error"), "There is an error");
        });

        expect(result[0]).toContain('"id":1');
        expect(result[0]).toContain('"stack":"Error: Some error');
        expect(result[0]).toContain('"msg":"There is an error"');
      });

      test("first argument of type `object`", () => {
        runWithSkog({ id: 1 }, () => {
          log.info({ a: 3 }, "Hello world");
        });

        expect(result[0]).toContain('"id":1');
        expect(result[0]).toContain('"a":3');
        expect(result[0]).toContain("Hello world");
      });
    });
  });
});
