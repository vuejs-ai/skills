import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/CounterStats.vue"),
  "utf-8"
);

test("Uses shallowRef for primitive state", () => {
  expect(content).toMatch(
    /import\s*\{[^}]*\bshallowRef\b[^}]*\}\s*from\s*['"]vue['"]/
  );
  expect(content).toMatch(/const\s+count\s*=\s*shallowRef\s*\(/);
  expect(content).toMatch(/const\s+label\s*=\s*shallowRef\s*\(/);
});

test("Uses computed for derived values", () => {
  const computedDeclarations =
    content.match(/const\s+\w+\s*=\s*computed\s*\(/g) ?? [];

  expect(computedDeclarations.length).toBeGreaterThanOrEqual(2);
});

test("Does not use watchers for derived state", () => {
  expect(content).not.toMatch(/watch(?:Effect)?\s*\(/);
});
