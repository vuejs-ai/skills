import { describe, expect, test } from "vitest";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT_DIR = join(process.cwd(), "..");
const SKILLS_DIR = join(ROOT_DIR, "skills");
const EVALS_DIR = join(ROOT_DIR, "evals/suites/skills");

// Skills without evals yet (remove from list when evals are added)
const SKIP_SKILLS = ["create-adaptable-composable", "vue-development-guides"];

function getSkills(): string[] {
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => !SKIP_SKILLS.includes(dirent.name))
    .map((dirent) => dirent.name);
}

function hasReferences(skillName: string): boolean {
  const referenceDir = join(SKILLS_DIR, skillName, "reference");
  const referencesDir = join(SKILLS_DIR, skillName, "references");
  return existsSync(referenceDir) || existsSync(referencesDir);
}

function getEvalNames(skillName: string): string[] {
  const skillEvalsDir = join(EVALS_DIR, skillName);
  if (!existsSync(skillEvalsDir)) {
    return [];
  }
  return readdirSync(skillEvalsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function hasEvalScenarios(skillName: string, evalName: string): boolean {
  const evalDir = join(EVALS_DIR, skillName, evalName);
  if (!existsSync(evalDir)) {
    return false;
  }
  const scenarios = readdirSync(evalDir, { withFileTypes: true }).filter(
    (dirent) => dirent.isDirectory() && /^\d+$/.test(dirent.name)
  );
  return scenarios.length > 0;
}

describe("Skill eval coverage", () => {
  const skills = getSkills();

  test.each(skills)("skill '%s' has at least one eval", (skillName) => {
    const evalNames = getEvalNames(skillName);
    const hasRefs = hasReferences(skillName);

    const evalsWithScenarios = evalNames.filter((evalName) =>
      hasEvalScenarios(skillName, evalName)
    );

    expect(
      evalsWithScenarios.length,
      hasRefs
        ? `Skill '${skillName}' has references but no evals. Add evals in evals/suites/skills/${skillName}/`
        : `Skill '${skillName}' has no references and no evals. Add at least one eval in evals/suites/skills/${skillName}/`
    ).toBeGreaterThan(0);
  });
});
