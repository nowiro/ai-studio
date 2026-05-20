---
id: prompt.review-pr
title: Review PR
type: prompt
target_agent: code-reviewer
version: 2.0.0
---

# Review PR prompt

Używaj tego gdy Orchestrator oddaje diff do **code-reviewer**.

## Inputs

- `{{PR_URL}}` — link do PR.
- `{{ADR}}` — opcjonalny ADR id, który ten PR implementuje.

## Task

Uruchom pełny review checklist z `.ai/agents/code-reviewer.md`. Używaj formatu YAML `review:` dla verdict.

## Required tooling

- Read diff (`gh pr diff {{PR_URL}}`).
- Uruchom `pnpm affected:lint`, `pnpm affected:test`, `pnpm typecheck` lokalnie jeśli jeszcze nie zielone.
- Otwórz `nx graph` (przez serwer **nx** MCP) before/after żeby spostrzec graph changes.
- Cross-check Angular APIs z serwerem **context7** MCP gdy w wątpliwościach.

## Tone

- Issues: actionable, nie preachy.
- Praise: specific.
- Jeden bullet = jeden concern.

## End with

```yaml
review:
  verdict: approved | request-changes
  blocking: [...]
  nice_to_have: [...]
  praises: [...]
```
