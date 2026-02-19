import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/ProductList.vue"),
  "utf-8"
);

test("Uses computed property for filtering, not a method", () => {
  // Should use computed() for the filtered list
  expect(content).toMatch(/const\s+\w+\s*=\s*computed\s*\(/);
});

test("Does not call a function in template for filtering", () => {
  // Should NOT have v-for with a method call like getFilteredProducts()
  expect(content).not.toMatch(/v-for="[^"]*\s+in\s+\w+\(\)"/);

  // Should NOT call a function in interpolation for the list
  expect(content).not.toMatch(
    /<template>[\s\S]*\{\{\s*\w+\(\)\.length\s*\}\}[\s\S]*<\/template>/
  );
});

test("Imports computed from vue", () => {
  expect(content).toMatch(/import\s*\{[^}]*\bcomputed\b[^}]*\}\s*from\s*['"]vue['"]/);
});
