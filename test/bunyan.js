const bunyan = require("../bunyan");
const skog = require("../index");
const test = require("ava");

test("Should the errors be propagated", async (t) => {
  bunyan.createLogger({ name: "example" });

  try {
    await skog.child({ a: 2 }, async () => {
      throw new Error("hola");
    });
  } catch (e) {
    t.is(e.message, "hola");
  }
});
