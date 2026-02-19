import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/ActiveUserList.vue"),
  "utf-8"
);

test("Defines users prop and renders a list", () => {
  expect(content).toMatch(/defineProps\s*[<(]/);
  expect(content).toMatch(/users/);
  expect(content).toMatch(/v-for="/);
});

test("Uses computed filtering for active users", () => {
  expect(content).toMatch(
    /import\s*\{[^}]*\bcomputed\b[^}]*\}\s*from\s*['"]vue['"]/
  );
  expect(content).toMatch(/computed\s*\(\s*\(\s*\)\s*=>[\s\S]*\.filter\s*\(/);
});

test("Does not place v-if and v-for on the same element", () => {
  const hasIfAndForOnSameElement =
    /<[^>\n]*\bv-if="[^"]*"[^>\n]*\bv-for="[^"]*"[^>]*>|<[^>\n]*\bv-for="[^"]*"[^>\n]*\bv-if="[^"]*"[^>]*>/.test(
      content
    );

  expect(hasIfAndForOnSameElement).toBe(false);
});
