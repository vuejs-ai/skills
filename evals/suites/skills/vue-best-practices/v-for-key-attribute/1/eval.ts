import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/ItemList.vue"),
  "utf-8"
);

test("Uses :key attribute with v-for", () => {
  // Should have :key or v-bind:key with v-for
  expect(content).toMatch(/v-for="[^"]*"[^>]*:key="[^"]*"/);
});

test("Uses unique identifier for key, not array index", () => {
  // Should use item.id or similar, not index
  expect(content).toMatch(/:key="[^"]*\.id"/);

  // Should NOT use index as key
  expect(content).not.toMatch(/:key="index"/);
  expect(content).not.toMatch(/:key="i"/);
});

test("Properly iterates with v-for", () => {
  // Should have v-for with item in items pattern
  expect(content).toMatch(/v-for="\s*\w+\s+in\s+items\s*"/);
});
