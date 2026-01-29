import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/ClickCounter.vue"),
  "utf-8"
);

test("Uses regular function syntax for methods, not arrow functions", () => {
  // Should NOT have arrow function syntax in methods
  // e.g., increment: () => { ... } or increment: () => this.count++
  expect(content).not.toMatch(/methods\s*:\s*\{[\s\S]*:\s*\([^)]*\)\s*=>/);

  // Should have regular method shorthand or function syntax
  // e.g., increment() { ... } or increment: function() { ... }
  expect(content).toMatch(/methods\s*:\s*\{/);
});

test("Has increment method that uses this", () => {
  // Should reference this.count in increment method
  expect(content).toMatch(/this\.count/);
});

test("Has setMessage method", () => {
  // Should have setMessage method
  expect(content).toMatch(/setMessage/);

  // Should reference this.message
  expect(content).toMatch(/this\.message/);
});

test("Uses Options API structure", () => {
  // Should have data() function
  expect(content).toMatch(/data\s*\(\s*\)\s*\{/);

  // Should have methods object
  expect(content).toMatch(/methods\s*:\s*\{/);

  // Should export default
  expect(content).toMatch(/export\s+default/);
});
