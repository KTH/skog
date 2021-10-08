import log from "./index";

test("`skog` uses `console` by default for logging", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr: any[] = [];

  global.console.log = (...args) => {
    arr.push(args);
  };
  log.fatal("Hello fatal");
  log.error("Hello error");
  log.warn("Hello warn");
  log.info("Hello info");
  log.debug("Hello debug");
  log.trace("Hello trace");

  expect(arr).toMatchInlineSnapshot(`
    Array [
      Array [
        "Hello fatal",
      ],
      Array [
        "Hello error",
      ],
      Array [
        "Hello warn",
      ],
      Array [
        "Hello info",
      ],
      Array [
        "Hello debug",
      ],
      Array [
        "Hello trace",
      ],
    ]
  `);
});
