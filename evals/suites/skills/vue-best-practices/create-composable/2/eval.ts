import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/composables/useDebounce.ts"),
  "utf-8"
);

test("Returns reactive debounced ref", () => {
  // Should use ref for reactive state
  expect(content).toMatch(/ref\s*[<(]/);
});

test("Accepts ref and delay as parameters", () => {
  // Should have function parameters for value and delay
  expect(content).toMatch(/function\s+useDebounce\s*\([^)]*\)|const\s+useDebounce\s*=\s*\([^)]*\)/);
});

test("Uses setTimeout/clearTimeout for debouncing", () => {
  // Should use setTimeout
  expect(content).toMatch(/setTimeout/);
  // Should use clearTimeout
  expect(content).toMatch(/clearTimeout/);
});

test("Cleans up on unmount", () => {
  // Should use onUnmounted or onScopeDispose for cleanup
  expect(content).toMatch(/onUnmounted|onScopeDispose/);
});

test("Uses Vue reactivity primitives", () => {
  // Should import from vue
  expect(content).toMatch(/from\s*['"]vue['"]/);

  // Should use watch or watchEffect
  expect(content).toMatch(/\bwatch\b|\bwatchEffect\b/);
});
