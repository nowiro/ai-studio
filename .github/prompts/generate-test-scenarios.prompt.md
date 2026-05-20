---
mode: agent
description: Generate Playwright E2E scenario skeletons from analytical specs
tools: ['editFiles', 'search', 'runCommands']
---

# Generate test scenarios

Zamień Given/When/Then acceptance criteria z `docs/analytical/specs/*.md` na Playwright skeletons, które **test-engineer** potem wypełni.

## Co robić

1. Uruchom deterministyczny ekstraktor:

   ```bash
   pnpm test:scenarios          # tools/scripts/scenarios-from-specs.mjs
                                # → tmp/scenarios/<spec-slug>.{json,spec.ts}
   ```

2. Załaduj `.ai/agents/test-scenario-author.md`.
3. Dla każdego generowanego `tmp/scenarios/<slug>.spec.ts`:
   - Move do `apps/<app>-e2e/src/specs/<slug>.e2e.ts`.
   - Zamień `// TODO: implement step` na konkretne `await page.…` calls **cytujące spec line** (`// from spec: docs/analytical/specs/<file>:<line>`).
   - Używaj `getByRole` najpierw, potem `getByTestId`. Żadnych CSS selectors.
   - Twórz / extenduj page objects pod `apps/<app>-e2e/src/pages/`.
4. Hand off do **test-engineer** żeby dodał fixtures, setup, i assertions.
5. Zweryfikuj przez `pnpm exec nx e2e <app>-e2e --grep=<slug>`.

## Nie

- Fabrykować scenariuszy, których nie ma w żadnym specu.
- Pomijać page-object refactor — inline locators gniją szybko.
- Markować `done:` jeśli suite nie biegnie zielono przynajmniej raz.
