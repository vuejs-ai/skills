---
title: Volar 3.0 Breaking Changes
impact: HIGH
impactDescription: fixes editor integration after Volar/vue-language-server upgrade
type: capability
tags: volar, vue-language-server, neovim, vscode, ide, ts_ls, vtsls
---

# Volar 3.0 Breaking Changes

**Impact: HIGH** - fixes editor integration after Volar/vue-language-server upgrade

Volar 3.0 (vue-language-server 3.x) introduced breaking changes to the language server protocol. Editors configured for Volar 2.x will break with errors like "vue_ls doesn't work with ts_ls.. it expects vtsls".

## Symptoms

- `vue_ls doesn't work with ts_ls`
- TypeScript features stop working in Vue files
- No autocomplete, type hints, or error highlighting
- Editor shows "Language server initialization failed"

## Fix by Editor

### VSCode

Update the "Vue - Official" extension to latest version. It manages the language server automatically.

### NeoVim (nvim-lspconfig)

**Option 1: Use vtsls instead of ts_ls**
```lua
-- Replace ts_ls/tsserver with vtsls
require('lspconfig').vtsls.setup({})
require('lspconfig').volar.setup({})
```

**Option 2: Downgrade vue-language-server**
```bash
npm install -g @vue/language-server@2.1.10
```

### JetBrains IDEs

Update to latest Vue plugin. If issues persist, disable and re-enable the Vue plugin.

## What Changed in 3.0

| Feature | Volar 2.x | Volar 3.0 |
|---------|-----------|-----------|
| TypeScript integration | ts_ls/tsserver | vtsls recommended (Neovim) |
| Hybrid mode | Optional | Default |

## Workaround: Stay on 2.x

If upgrading is not possible:
```bash
npm install -g @vue/language-server@^2.0.0
```

Pin in your project's package.json to prevent accidental upgrades.

## Reference

- [vuejs/language-tools#5598](https://github.com/vuejs/language-tools/issues/5598)
- [NeoVim Vue Setup Guide](https://dev.to/danwalsh/solved-vue-3-typescript-inlay-hint-support-in-neovim-53ej)
