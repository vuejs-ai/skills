# Vue Skills Development Guide

## Skill Scopes

| Skill | Scope |
|-------|-------|
| **vue-best-practices** | Vue 3 with Composition API, `<script setup lang="ts">`, TypeScript, SSR. Includes render functions for cases where templates can't handle the requirement. |
| **vue-options-api-best-practices** | Vue 3 Options API style (`data()`, `methods`, `this` context). Each rule shows Options API solution only. |
| **vue-jsx-best-practices** | JSX syntax in Vue (e.g., `class` vs `className`, JSX plugin config). |
| **vue-testing-best-practices** | Testing with Vitest, Vue Test Utils, and Playwright for E2E. |
| **vue-router-best-practices** | Vue Router 4 patterns, navigation guards, route params, and route-component lifecycle interactions. |
| **vue-pinia-best-practices** | Pinia stores, state management patterns, store setup, and reactivity with stores. |

## Common Pitfalls & Best Practices

- **Vue-specific only:** Reference files must cover Vue patterns and gotchas, not general web/JS knowledge.
- **No edge cases:** Avoid niche scenarios, tool-specific quirks, and obvious/well-known practices.
- **Required structure:** Each reference file needs title, impact level, task checklist, and incorrect/correct code examples.
- **SKILL.md is for coding agents:** Follow [official best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices): be concise (context window is a public good), assume the coding agent is smart (only add what it doesn't know), no hardcoded counts or historical background. Use progressive disclosure — SKILL.md is an overview that points to reference files.

## Checklist for effective Skills

Before sharing a Skill, verify:

### Core quality
- [ ] Description is specific and includes key terms
- [ ] Description includes both what the Skill does and when to use it
- [ ] SKILL.md body is under 500 lines
- [ ] Additional details are in separate files (if needed)
- [ ] No time-sensitive information (or in "old patterns" section)
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps

### Code and scripts
- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] No "voodoo constants" (all values justified)
- [ ] Required packages listed in instructions and verified as available
- [ ] Scripts have clear documentation
- [ ] No Windows-style paths (all forward slashes)
- [ ] Validation/verification steps for critical operations
- [ ] Feedback loops included for quality-critical tasks
