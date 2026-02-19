import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const composableContent = readFileSync(
  join(process.cwd(), "src/composables/useCart.ts"),
  "utf-8"
);
const componentContent = readFileSync(
  join(process.cwd(), "src/components/CartSummary.vue"),
  "utf-8"
);

test("Composable defines useCart and derives total with computed", () => {
  expect(composableContent).toMatch(/\buseCart\s*\(/);
  expect(composableContent).toMatch(/\bcomputed\s*\(/);
});

test("Composable exposes readonly items and explicit actions", () => {
  expect(composableContent).toMatch(
    /\breadonly\s*\(/
  );
  expect(composableContent).toMatch(/\baddItem\b/);
  expect(composableContent).toMatch(/\bremoveItem\b/);
});

test("Component uses the composable and its actions", () => {
  expect(componentContent).toMatch(
    /\buseCart\b/
  );
  expect(componentContent).toMatch(/useCart\s*\(/);
  expect(componentContent).toMatch(/\btotal\b/);
  expect(componentContent).toMatch(/\baddItem\b|\bremoveItem\b/);
});
