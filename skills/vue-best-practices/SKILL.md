---
name: vue-best-practices
description: Vue 3 and Vue.js best practices for TypeScript, vue-tsc, and Volar. This skill should be used when writing, reviewing, or refactoring Vue components to ensure correct typing patterns. Triggers on tasks involving Vue components, props extraction, wrapper components, template type checking, or Volar configuration.
license: MIT
metadata:
  author: hyf0
  version: "8.0.0"
---

## Capability Rules

| Rule | Keywords | Description |
|------|----------|-------------|
| [extract-component-props](rules/extract-component-props.md) | get props type, wrapper component, extend props, inherit props, ComponentProps | Extract types from .vue components |
| [vue-tsc-strict-templates](rules/vue-tsc-strict-templates.md) | undefined component, template error, strictTemplates | Catch undefined components in templates |
| [fallthrough-attributes](rules/fallthrough-attributes.md) | fallthrough, $attrs, wrapper component | Type-check fallthrough attributes |
| [strict-css-modules](rules/strict-css-modules.md) | css modules, $style, typo | Catch CSS module class typos |
| [data-attributes-config](rules/data-attributes-config.md) | data-*, strictTemplates, attribute | Allow data-* attributes |
| [volar-3-breaking-changes](rules/volar-3-breaking-changes.md) | volar, vue-language-server, editor | Fix Volar 3.0 upgrade issues |
| [module-resolution-bundler](rules/module-resolution-bundler.md) | cannot find module, @vue/tsconfig, moduleResolution | Fix module resolution errors |
| [define-model-update-event](rules/define-model-update-event.md) | defineModel, update event, undefined | Fix model update errors |
| [with-defaults-union-types](rules/with-defaults-union-types.md) | withDefaults, union type, default | Fix union type defaults |
| [deep-watch-numeric](rules/deep-watch-numeric.md) | watch, deep, array, Vue 3.5 | Efficient array watching |
| [vue-directive-comments](rules/vue-directive-comments.md) | @vue-ignore, @vue-skip, template | Control template type checking |
| [vue-router-typed-params](rules/vue-router-typed-params.md) | route params, typed router, unplugin | Fix route params typing |

## Efficiency Rules

| Rule | Keywords | Description |
|------|----------|-------------|
| [hmr-vue-ssr](rules/hmr-vue-ssr.md) | hmr, ssr, hot reload | Fix HMR in SSR apps |
| [pinia-store-mocking](rules/pinia-store-mocking.md) | pinia, mock, vitest, store | Mock Pinia stores |

## Reference

- [Vue Language Tools](https://github.com/vuejs/language-tools)
- [vue-component-type-helpers](https://github.com/vuejs/language-tools/tree/master/packages/component-type-helpers)
- [Vue 3 Documentation](https://vuejs.org/)
