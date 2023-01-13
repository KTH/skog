import { runWithSkog, getFields, setFields } from "../src/asyncContext";
import { setTimeout } from "timers/promises";

// Helper functions to emulate a console in a very simple way
let output: string[] = [];

function printMessage(message: string) {
  const fields = getFields();

  if (!fields) {
    output.push(message);
    return;
  }

  output.push(`${fields.id}: ${message}`);
}

describe("asyncContext.getFields", () => {
  beforeEach(() => {
    output = [];
  });

  test("returns null in the beginning", () => {
    expect(getFields()).toEqual(null);
  });

  test("keeps values in a context when opened parallel", async () => {
    printMessage("Hello");
    setFields({ id: "X" });

    const p = runWithSkog({ id: "A" }, async () => {
      await setTimeout(100);
      printMessage("Hello");
    });

    printMessage("Hello");
    await p;
    printMessage("Bye");

    expect(output).toEqual(["Hello", "X: Hello", "A: Hello", "X: Bye"]);
  });

  test("supports parallel contexts", async () => {
    async function printId(id: string) {
      return runWithSkog({ id }, async () => {
        await setTimeout(Math.random() * 100);
        printMessage("1");
        await setTimeout(Math.random() * 100);
        printMessage("2");
        await setTimeout(Math.random() * 100);
        printMessage("3");
      });
    }

    await Promise.all([printId("A"), printId("B"), printId("C")]);

    // The order of the output doesn't matter.
    // We are just testing that all numbers have a letter
    expect(output.sort()).toEqual([
      "A: 1",
      "A: 2",
      "A: 3",
      "B: 1",
      "B: 2",
      "B: 3",
      "C: 1",
      "C: 2",
      "C: 3",
    ]);
  });
});
