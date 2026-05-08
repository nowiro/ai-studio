---
mode: agent
description: Generate Playwright E2E scenario skeletons from analytical specs
tools: ["editFiles", "search", "runCommands"]
---

# Generate test scenarios

Turn Given/When/Then acceptance criteria from `docs/analytical/specs/*.md` into Playwright skeletons that the **test-engineer** then fleshes out.

## What to do

1. Run the deterministic extractor:

   ```bash
   pnpm test:scenarios          # tools/scripts/scenarios-from-specs.mjs
                                # → tmp/scenarios/<spec-slug>.{json,spec.ts}
   ```

2. Load `.ai/agents/test-scenario-author.md`.
3. For each generated `tmp/scenarios/<slug>.spec.ts`:
   - Move it to `apps/<app>-e2e/src/specs/<slug>.e2e.ts`.
   - Replace `// TODO: implement step` with concrete `await page.…` calls **citing the spec line** (`// from spec: docs/analytical/specs/<file>:<line>`).
   - Use `getByRole` first, then `getByTestId`. No CSS selectors.
   - Create / extend page objects under `apps/<app>-e2e/src/pages/`.
4. Hand off to **test-engineer** to add fixtures, setup, and assertions.
5. Verify with `pnpm exec nx e2e <app>-e2e --grep=<slug>`.

## Don't

- Fabricate scenarios that aren't in any spec.
- Skip the page-object refactor — inline locators rot fast.
- Mark `done:` if the suite doesn't run green at least once.
