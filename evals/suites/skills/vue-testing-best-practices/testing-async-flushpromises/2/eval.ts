import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const testFileContent = readFileSync(
  join(process.cwd(), "src/components/SearchResults.test.ts"),
  "utf-8"
);

test("Uses async/await for test functions", () => {
  // Should have async test functions
  expect(testFileContent).toMatch(/async\s*\(\s*\)\s*=>/);
});

test("Uses flushPromises for async operations", () => {
  // Should import flushPromises from @vue/test-utils
  expect(testFileContent).toMatch(/flushPromises/);

  // Should await flushPromises
  expect(testFileContent).toMatch(/await\s+flushPromises\s*\(\s*\)/);
});

test("Awaits trigger calls", () => {
  // Should await trigger for button clicks
  expect(testFileContent).toMatch(/await\s+.*trigger\s*\(/);
});
