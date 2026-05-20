---
id: prompt.generate-library
title: Generate library
type: prompt
target_agent: orchestrator
version: 2.0.0
---

# Generate Library prompt

Używaj tego templatu gdy scaffoldujesz nowy Nx library, w lock-step z `.ai/workflows/new-library.md`.

## Variables

- `{{NAME}}` — kebab-case (np. `billing`, `theme`, `feature-flags`).
- `{{SCOPE}}` — `feature | ui | data | util | shared`.
- `{{TYPE}}` — `feature | ui | data-access | util`.
- `{{DOMAIN}}` — opcjonalny domain tag (np. `billing`, `auth`).

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

## Required edits po generacji

1. `src/index.ts` — trzymaj go jako single export surface (żadnych deep imports).
2. Dodaj `README.md`:

   ```markdown
   # @ai-studio/{{SCOPE}}-{{NAME}}

   <one-line purpose>

   ## Public API

   | Export | Kind | Notes |
   | ------ | ---- | ----- |

   ## Used by

   - …
   ```

3. Dodaj lib do `docs/architecture/dependencies.md`.

4. Update CODEOWNERS z odpowiednim zespołem.

## Verification

- `nx show projects --affected` listuje nowy lib.
- `nx graph` pokazuje go pod prawą warstwą.
- `pnpm affected:lint && pnpm affected:test` zielone.
