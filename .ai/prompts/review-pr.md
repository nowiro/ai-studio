---
id: prompt.review-pr
title: Review PR
type: prompt
target_agent: code-reviewer
version: 1.0.0
---

# Review PR prompt

Use this when the Orchestrator hands a diff to the **code-reviewer**.

## Inputs

- `{{PR_URL}}` — link to the PR.
- `{{ADR}}` — optional ADR id this PR implements.

## Task

Run the full review checklist from `.ai/agents/code-reviewer.md`. Use the `review:` YAML format for the verdict.

## Required tooling

- Read the diff (`gh pr diff {{PR_URL}}`).
- Run `pnpm affected:lint`, `pnpm affected:test`, `pnpm typecheck` locally if not already green.
- Open `nx graph` (via the **nx** MCP server) before/after to spot graph changes.
- Cross-check Angular APIs with the **context7** MCP server when in doubt.

## Tone

- Issues: actionable, not preachy.
- Praise: specific.
- One bullet = one concern.

## End with

```yaml
review:
  verdict: approved | request-changes
  blocking: [...]
  nice_to_have: [...]
  praises: [...]
```
