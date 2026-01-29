import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/UserList.vue"),
  "utf-8"
);

test("Does not use v-if and v-for on the same element", () => {
  // Should NOT have both v-if and v-for on the same element
  // This regex matches an element with both directives in either order
  expect(content).not.toMatch(/<\w+[^>]*v-for="[^"]*"[^>]*v-if="[^"]*"/);
  expect(content).not.toMatch(/<\w+[^>]*v-if="[^"]*"[^>]*v-for="[^"]*"/);
});

test("Uses computed property for filtering active users", () => {
  // Should use computed() for filtering
  expect(content).toMatch(/computed\s*\(/);

  // Should filter by isActive
  expect(content).toMatch(/\.filter\s*\([^)]*isActive/);
});

test("Handles showList prop correctly", () => {
  // Should have v-if for showList (on a wrapper element, not on the v-for element)
  expect(content).toMatch(/v-if="showList"/);
});
