---
mode: agent
description: Execute generated E2E scenarios — Playwright runner first, MCP for live debugging
tools: ["editFiles", "search", "runCommands", "problems"]
---

# Run test scenarios

## What to do

1. **Run them headless first** (the real validator):

   ```bash
   pnpm exec nx affected -t e2e --parallel=1
   ```

   - Uploads HTML report + traces under `playwright-report/` and `test-results/`.

2. **For failing scenarios**, switch to live debugging via the **playwright** MCP server:
   - Navigate to the failing route.
   - Snapshot the page; verify selectors with `find` queries.
   - Confirm the missing assertion or interaction.
   - Patch the test file (or the page object) — the smallest change that turns the test green for the right reason.

3. Re-run the affected suite. Loop until green or until you have a `blocked:` reason.

## Don't

- Use the MCP browser to "fix" tests by loosening assertions. The test exists to catch a defect — debug the defect.
- Disable failing tests. Either fix the test, fix the code, or open a bug-fix issue.
- Run E2E in production. Always against the local dev server / preview env declared in `playwright.config.base.ts`.

## Reporting back

End with:

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
