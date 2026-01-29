import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/FormValidator.vue"),
  "utf-8"
);

test("Uses regular function syntax for methods, not arrow functions", () => {
  // Should NOT have arrow function syntax in methods
  // e.g., validate: () => { ... } or validate: () => this.isValid = true
  expect(content).not.toMatch(/methods\s*:\s*\{[\s\S]*:\s*\([^)]*\)\s*=>/);

  // Should have regular method shorthand or function syntax
  // e.g., validate() { ... } or validate: function() { ... }
  expect(content).toMatch(/methods\s*:\s*\{/);
});

test("Has validate method that uses this", () => {
  // Should reference this.email or this.isValid in validate method
  expect(content).toMatch(/this\.email|this\.isValid/);
});

test("Has clearForm method", () => {
  // Should have clearForm method
  expect(content).toMatch(/clearForm/);
});

test("Uses Options API structure", () => {
  // Should have data() function
  expect(content).toMatch(/data\s*\(\s*\)\s*\{/);

  // Should have methods object
  expect(content).toMatch(/methods\s*:\s*\{/);

  // Should export default
  expect(content).toMatch(/export\s+default/);
});
