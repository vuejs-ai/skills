import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineExperiment, defineDockerEnvironment } from 'evalspace'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

const environment = defineDockerEnvironment({
  mode: 'multi',
  agent: {
    name: 'codex',
    options: {
      model: 'gpt-5-codex-mini',
      codexAuth: {
        method: 'auth-file',
      }
    },
  }
})

export default defineExperiment({
  name: 'vue-best-practices-skills',
  environment,
  evals: '*',
  scripts: {
    install: 'npm install',
    verify: 'npm run test',
  },
  hooks: {
    'workspace:prepare': async ({ workspace }) => {
      await workspace.copyIn(path.join(currentDir, './templates/default'), '.')
      await workspace.copyIn(path.join(currentDir, '../skills/vue-best-practices'), '.codex/skills/vue-best-practices')
    },
  },
  verifyFiles: [
    '*.test.ts'
  ]
})
