---
description: Execute generated E2E scenarios; use Playwright MCP for live debugging on failure
argument-hint: [grep filter, e.g. checkout-flow]
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Agent
---

Steps:

1. Run the affected E2E suite headless first:

   ```
   pnpm exec nx affected -t e2e --parallel=1 --grep=$ARGUMENTS
   ```

2. For failing scenarios, spawn the **test-engineer** subagent and let it use the **playwright** MCP server for live debugging:
   - Navigate to the failing route.
   - Snapshot the page; verify selectors with `find` queries.
   - Identify the missing assertion or interaction.
   - Patch the test file or page object — smallest change for the test to fail/pass for the right reason.
3. Re-run the affected suite. Loop until green or a `blocked:` reason emerges.
4. Report back with the `e2e_run:` block from `.github/prompts/run-test-scenarios.prompt.md`.

Twin Copilot prompt: [`.github/prompts/run-test-scenarios.prompt.md`](../../.github/prompts/run-test-scenarios.prompt.md).
