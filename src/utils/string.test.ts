import { test } from "node:test";
import assert from "node:assert";
import { formatTag, slugify } from "./string.ts";

test("formatTag formats tags correctly", () => {
  assert.strictEqual(formatTag("dsa-sheet"), "DSA Sheet");
  assert.strictEqual(formatTag("dynamic_programming"), "Dynamic Programming");
  assert.strictEqual(formatTag("dp"), "DP");
  assert.strictEqual(formatTag("oops"), "OOPS");
  assert.strictEqual(formatTag(""), "");
});

test("slugify slugifies text correctly", () => {
  assert.strictEqual(slugify("DSA Sheet"), "dsa-sheet");
  assert.strictEqual(slugify("Hello_World!!!"), "hello-world");
  assert.strictEqual(slugify("   trailing-and-leading-   "), "trailing-and-leading");
  assert.strictEqual(slugify(""), "");
});
