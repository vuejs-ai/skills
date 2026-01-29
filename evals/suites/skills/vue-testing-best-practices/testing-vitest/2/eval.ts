import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const testFileContent = readFileSync(
  join(process.cwd(), "src/components/Toggle.test.ts"),
  "utf-8"
);

test("Uses Vitest test APIs", () => {
  // Should import from vitest
  expect(testFileContent).toMatch(/from\s*['"]vitest['"]/);

  // Should use test or it or describe
  expect(testFileContent).toMatch(/\b(test|it|describe)\s*\(/);
});

test("Uses @vue/test-utils mount", () => {
  // Should import mount from @vue/test-utils
  expect(testFileContent).toMatch(/import\s*\{[^}]*\bmount\b[^}]*\}\s*from\s*['"]@vue\/test-utils['"]/);

  // Should call mount
  expect(testFileContent).toMatch(/mount\s*\(\s*Toggle/);
});

test("Tests component interactions", () => {
  // Should test clicking buttons
  expect(testFileContent).toMatch(/trigger\s*\(\s*['"]click['"]\s*\)/);

  // Should use async/await for interactions
  expect(testFileContent).toMatch(/await\s+.*trigger/);
});
