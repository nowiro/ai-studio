---
description: Generate Playwright E2E scenario skeletons from analytical specs
argument-hint: [spec-slug or empty for all specs]
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Agent
---

Steps:

1. Run `pnpm test:scenarios` to extract Given/When/Then triples deterministically into `tmp/scenarios/`.
2. Spawn the **test-scenario-author** subagent with the list of generated skeletons.
3. The agent moves each skeleton to `apps/<app>-e2e/src/specs/<slug>.e2e.ts`, replaces TODOs with concrete `page.…` calls citing spec lines, and creates / extends page objects.
4. Hand off to **test-engineer** for fixtures and assertions.
5. Verify with `pnpm exec nx affected -t e2e --grep=$ARGUMENTS` (or no grep if no slug given).

Twin Copilot prompt: [`.github/prompts/generate-test-scenarios.prompt.md`](../../.github/prompts/generate-test-scenarios.prompt.md).
