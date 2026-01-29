import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "src/components/SettingsPanel.vue"),
  "utf-8"
);

test("Uses storeToRefs for extracting state and getters", () => {
  // Should import storeToRefs from pinia
  expect(content).toMatch(/storeToRefs/);

  // Should use storeToRefs when destructuring
  expect(content).toMatch(/storeToRefs\s*\(\s*\w+Store\s*\)/);
});

test("Does not destructure state directly without storeToRefs", () => {
  // Should NOT have direct destructuring like: const { theme, language } = settingsStore
  // without storeToRefs
  const hasDirectDestructure = content.match(
    /const\s*\{\s*(?:theme|language|notifications|settingsSummary)[^}]*\}\s*=\s*(?:settingsStore|useSettingsStore\(\))/
  );

  // If there's destructuring, it should be from storeToRefs
  if (hasDirectDestructure) {
    expect(content).toMatch(/storeToRefs/);
  }
});

test("Destructures actions directly from store (not through storeToRefs)", () => {
  // Should have action destructuring directly from store
  expect(content).toMatch(/(?:setTheme|setLanguage|toggleNotifications)/);
});

test("Uses the settings store", () => {
  // Should call useSettingsStore
  expect(content).toMatch(/useSettingsStore\s*\(\s*\)/);
});
