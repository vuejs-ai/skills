import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/Card.tsx"),
  "utf-8"
);

test("Uses 'class' instead of 'className'", () => {
  // Should use class, not className
  expect(content).toMatch(/class="/);

  // Should NOT use className (React convention)
  expect(content).not.toMatch(/className="/);
});

test("Does not use React-style htmlFor", () => {
  // If there's a label, it should use 'for', not 'htmlFor'
  // This is a soft check - only fails if htmlFor is actually used
  expect(content).not.toMatch(/htmlFor="/);
});

test("Uses Vue JSX syntax", () => {
  // Should define a Vue component
  expect(content).toMatch(/defineComponent|setup\s*\(/);

  // Should return JSX from setup or render
  expect(content).toMatch(/return\s*\(\s*\)/s.test(content) || content.includes("return () =>"));
});

test("Has proper class attributes", () => {
  // Should have the card classes
  expect(content).toMatch(/class="[^"]*card[^"]*"/);
});
