import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const quantityInputContent = readFileSync(
  join(process.cwd(), "src/components/QuantityInput.vue"),
  "utf-8"
);
const appContent = readFileSync(join(process.cwd(), "src/App.vue"), "utf-8");

test("Child component uses defineModel for v-model contract", () => {
  expect(quantityInputContent).toMatch(
    /const\s+\w+\s*=\s*defineModel(?:<[^>]+>)?\s*\(/
  );
});

test("Child does not use legacy modelValue/update:modelValue pattern", () => {
  expect(quantityInputContent).not.toMatch(/modelValue/);
  expect(quantityInputContent).not.toMatch(/update:modelValue/);
});

test("App uses v-model with QuantityInput and owns state", () => {
  expect(appContent).toMatch(/<QuantityInput[\s\S]*v-model="quantity"/);
  expect(appContent).toMatch(/const\s+quantity\s*=\s*(?:shallowRef|ref)\s*\(/);
  expect(appContent).toMatch(/\{\{\s*quantity\s*\}\}/);
});
