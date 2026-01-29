import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/FormField.tsx"),
  "utf-8"
);

test("Uses 'class' instead of 'className'", () => {
  // Should use class, not className
  expect(content).toMatch(/class="/);

  // Should NOT use className (React convention)
  expect(content).not.toMatch(/className="/);
});

test("Uses 'for' instead of 'htmlFor' for label", () => {
  // Should use 'for', not 'htmlFor'
  expect(content).not.toMatch(/htmlFor="/);

  // Should have for attribute on label
  expect(content).toMatch(/for=/);
});

test("Uses Vue JSX syntax", () => {
  // Should define a Vue component
  expect(content).toMatch(/defineComponent|setup\s*\(/);

  // Should return JSX from setup or render
  expect(content).toMatch(/return\s*\(\s*\)/s.test(content) || content.includes("return () =>"));
});

test("Has proper class attributes", () => {
  // Should have the form field classes
  expect(content).toMatch(/class="[^"]*form[^"]*"/);
});
