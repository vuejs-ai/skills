import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/composables/useAsync.ts"),
  "utf-8"
);

test("Returns reactive state (data, loading, error)", () => {
  // Should use ref for reactive state
  expect(content).toMatch(/ref\s*[<(]/);

  // Should return data, loading, error
  expect(content).toMatch(/data/);
  expect(content).toMatch(/loading/);
  expect(content).toMatch(/error/);
});

test("Accepts a function as parameter", () => {
  // Should have a function parameter
  expect(content).toMatch(/function\s+useAsync\s*\([^)]*\)|const\s+useAsync\s*=\s*\([^)]*\)/);
});

test("Has execute function", () => {
  // Should define and return an execute function
  expect(content).toMatch(/execute/);
});

test("Handles loading state", () => {
  // Should set loading to true/false
  expect(content).toMatch(/loading\.value\s*=\s*true/);
  expect(content).toMatch(/loading\.value\s*=\s*false/);
});

test("Uses Vue reactivity primitives", () => {
  // Should import from vue
  expect(content).toMatch(/from\s*['"]vue['"]/);

  // Should use ref
  expect(content).toMatch(/\bref\b/);
});
