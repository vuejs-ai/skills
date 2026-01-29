import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/composables/useLocalStorage.ts"),
  "utf-8"
);

test("Returns reactive ref synced with localStorage", () => {
  // Should use ref for reactive state
  expect(content).toMatch(/ref\s*[<(]/);
});

test("Accepts key and initial value as parameters", () => {
  // Should have function parameters for key and initial value
  expect(content).toMatch(/function\s+useLocalStorage\s*\([^)]*\)|const\s+useLocalStorage\s*=\s*\([^)]*\)/);
});

test("Uses JSON.stringify/parse for serialization", () => {
  // Should use JSON.stringify
  expect(content).toMatch(/JSON\.stringify/);
  // Should use JSON.parse
  expect(content).toMatch(/JSON\.parse/);
});

test("Watches for changes to update localStorage", () => {
  // Should use watch or watchEffect
  expect(content).toMatch(/\bwatch\b|\bwatchEffect\b/);
  // Should use localStorage.setItem
  expect(content).toMatch(/localStorage\.setItem/);
});

test("Uses Vue reactivity primitives", () => {
  // Should import from vue
  expect(content).toMatch(/from\s*['"]vue['"]/);
});
