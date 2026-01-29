import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/OrderList.vue"),
  "utf-8"
);

test("Does not use v-if and v-for on the same element", () => {
  // Should NOT have both v-if and v-for on the same element
  // This regex matches an element with both directives in either order
  expect(content).not.toMatch(/<\w+[^>]*v-for="[^"]*"[^>]*v-if="[^"]*"/);
  expect(content).not.toMatch(/<\w+[^>]*v-if="[^"]*"[^>]*v-for="[^"]*"/);
});

test("Uses computed property for filtering pending orders", () => {
  // Should use computed() for filtering
  expect(content).toMatch(/computed\s*\(/);

  // Should filter by isPending
  expect(content).toMatch(/\.filter\s*\([^)]*isPending/);
});

test("Handles isExpanded prop correctly", () => {
  // Should have v-if for isExpanded (on a wrapper element, not on the v-for element)
  expect(content).toMatch(/v-if="isExpanded"/);
});
