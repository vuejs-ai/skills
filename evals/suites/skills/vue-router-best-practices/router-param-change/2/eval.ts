import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/ProductDetail.vue"),
  "utf-8"
);

test("Uses watch on route params or onBeforeRouteUpdate", () => {
  // Should use watch with route.params OR onBeforeRouteUpdate
  const hasWatch = content.match(/watch\s*\(\s*\(\)\s*=>\s*route\.params/);
  const hasRouteUpdate = content.match(/onBeforeRouteUpdate/);

  expect(hasWatch || hasRouteUpdate).toBeTruthy();
});

test("Has immediate option for initial load if using watch", () => {
  // If using watch, should have immediate: true
  const hasWatch = content.match(/watch\s*\(/);
  if (hasWatch) {
    expect(content).toMatch(/immediate\s*:\s*true/);
  }
});

test("Does not rely solely on onMounted for data fetching", () => {
  // If it uses onMounted for fetching, it should also have watch or onBeforeRouteUpdate
  const hasOnMountedFetch = content.match(/onMounted\s*\([^)]*fetch/);
  if (hasOnMountedFetch) {
    const hasWatch = content.match(/watch\s*\(/);
    const hasRouteUpdate = content.match(/onBeforeRouteUpdate/);
    expect(hasWatch || hasRouteUpdate).toBeTruthy();
  }
});

test("Uses vue-router composables", () => {
  // Should import useRoute from vue-router
  expect(content).toMatch(/useRoute/);
});
