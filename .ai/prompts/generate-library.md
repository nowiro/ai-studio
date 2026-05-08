---
id: prompt.generate-library
title: Generate library
type: prompt
target_agent: orchestrator
version: 1.0.0
---

# Generate Library prompt

Use this template when scaffolding a new Nx library, in lock-step with `.ai/workflows/new-library.md`.

## Variables

- `{{NAME}}` — kebab-case (e.g. `billing`, `theme`, `feature-flags`).
- `{{SCOPE}}` — `feature | ui | data | util | shared`.
- `{{TYPE}}` — `feature | ui | data-access | util`.
- `{{DOMAIN}}` — optional domain tag (e.g. `billing`, `auth`).

## Generator command

```
nx g @nx/angular:lib {{NAME}} \
  --directory={{SCOPE}}/{{NAME}} \
  --tags=scope:{{SCOPE}},type:{{TYPE}}{{#DOMAIN}},domain:{{DOMAIN}}{{/DOMAIN}} \
  --change-detection=OnPush \
  --standalone \
  --buildable=false \
  --skip-tests=false \
  --linter=eslint \
  --unit-test-runner=vitest
```

## Required edits after generation

1. `src/index.ts` — keep it as the single export surface (no deep imports).
2. Add `README.md`:

   ```markdown
   # @ai-studio/{{SCOPE}}-{{NAME}}

   <one-line purpose>

   ## Public API

   | Export | Kind | Notes |
   | ------ | ---- | ----- |

   ## Used by

   - …
   ```

3. Add the lib to `docs/architecture/dependencies.md`.

4. Update CODEOWNERS with the relevant team.

## Verification

- `nx show projects --affected` lists the new lib.
- `nx graph` shows it under the right layer.
- `pnpm affected:lint && pnpm affected:test` green.
