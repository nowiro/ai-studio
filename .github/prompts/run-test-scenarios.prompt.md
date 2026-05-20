---
mode: agent
description: Execute generated E2E scenarios — Playwright runner first, MCP for live debugging
tools: ['editFiles', 'search', 'runCommands', 'problems']
---

# Run test scenarios

## Co robić

1. **Uruchom headless najpierw** (prawdziwy walidator):

   ```bash
   pnpm exec nx affected -t e2e --parallel=1
   ```

   - Uploaduje HTML report + traces pod `playwright-report/` i `test-results/`.

2. **Dla failujących scenariuszy**, przełącz na live debugging przez serwer **playwright** MCP:
   - Navigate do failującej route.
   - Snapshot strony; weryfikuj selektory przez queries `find`.
   - Potwierdź brakującą assertion lub interakcję.
   - Patch test file (lub page object) — najmniejsza zmiana zazieleniająca test z odpowiedniego powodu.

3. Re-run affected suite. Loop aż do zielonego lub aż masz powód `blocked:`.

## Nie

- Używaj MCP browsera do "fixowania" testów przez loosening assertions. Test istnieje żeby łapać defekt — debuguj defekt.
- Wyłączaj failing testów. Albo fix test, albo fix kod, albo otwórz bug-fix issue.
- Uruchamiaj E2E w produkcji. Zawsze przeciw local dev server / preview env zadeklarowanemu w `playwright.config.base.ts`.

## Reporting back

Zakończ:

```yaml
e2e_run:
  total: <N>
  passed: <N>
  failed: <N>
  flaky: <N>
  affected_apps: [...]
  artefacts:
    - playwright-report/index.html
    - test-results/...
  next_steps: [...]
```
