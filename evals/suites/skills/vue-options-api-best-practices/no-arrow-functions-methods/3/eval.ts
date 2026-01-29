import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/Timer.vue"),
  "utf-8"
);

test("Uses regular function syntax for methods, not arrow functions", () => {
  // Should NOT have arrow function syntax in methods
  // e.g., start: () => { ... } or start: () => this.isRunning = true
  expect(content).not.toMatch(/methods\s*:\s*\{[\s\S]*:\s*\([^)]*\)\s*=>/);

  // Should have regular method shorthand or function syntax
  // e.g., start() { ... } or start: function() { ... }
  expect(content).toMatch(/methods\s*:\s*\{/);
});

test("Has start method that uses this", () => {
  // Should reference this.seconds or this.isRunning in start method
  expect(content).toMatch(/this\.seconds|this\.isRunning/);
});

test("Has stop and reset methods", () => {
  // Should have stop method
  expect(content).toMatch(/stop/);

  // Should have reset method
  expect(content).toMatch(/reset/);
});

test("Uses Options API structure", () => {
  // Should have data() function
  expect(content).toMatch(/data\s*\(\s*\)\s*\{/);

  // Should have methods object
  expect(content).toMatch(/methods\s*:\s*\{/);

  // Should export default
  expect(content).toMatch(/export\s+default/);
});
