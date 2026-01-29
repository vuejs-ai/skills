import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/NotificationList.vue"),
  "utf-8"
);

test("Does not use v-if and v-for on the same element", () => {
  // Should NOT have both v-if and v-for on the same element
  // This regex matches an element with both directives in either order
  expect(content).not.toMatch(/<\w+[^>]*v-for="[^"]*"[^>]*v-if="[^"]*"/);
  expect(content).not.toMatch(/<\w+[^>]*v-if="[^"]*"[^>]*v-for="[^"]*"/);
});

test("Uses computed property for filtering unread notifications", () => {
  // Should use computed() for filtering
  expect(content).toMatch(/computed\s*\(/);

  // Should filter by isUnread
  expect(content).toMatch(/\.filter\s*\([^)]*isUnread/);
});

test("Handles showPanel prop correctly", () => {
  // Should have v-if for showPanel (on a wrapper element, not on the v-for element)
  expect(content).toMatch(/v-if="showPanel"/);
});
