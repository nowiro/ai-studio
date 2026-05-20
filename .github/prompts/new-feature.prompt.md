---
mode: agent
description: Run the full new-feature workflow (analyst → architect → dev + test in parallel → reviewer + auditor → doc-writer)
tools: ['editFiles', 'search', 'runCommands', 'runTasks', 'problems']
---

# New feature

Uruchom pełny multi-agent flow zdefiniowany w [`.ai/workflows/new-feature.md`](../../.ai/workflows/new-feature.md).

## Inputs

- `${input:feature:Describe the feature in one sentence}` — high-level cel
- `${input:size:T-shirt size (XS/S/M/L/XL)}` — szacowany effort
- `${selection}` — opcjonalny code context

## Co robić

1. Przełącz na chat mode **orchestrator** (lub śledź instrukcje orchestratora inline, jeśli niedostępny).
2. Przeczytaj wszystkie `.ai/rules/`, rolę orchestratora pod `.ai/agents/orchestrator.md`, i workflow pod `.ai/workflows/new-feature.md`.
3. Zdekomponuj zadanie używając protokołu `delegate:` YAML z pliku roli orchestratora.
4. Sekwencjonuj specjalistów wg workflow:
   1. analyst → spec
   2. architect → ADR + generator plan
   3. generatory nx + angular-cli
   4. frontend-developer + (opcjonalnie) backend-developer + test-engineer równolegle
   5. code-reviewer + (gdy relevant) security-auditor
   6. doc-writer
5. Validuj przez `pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build && pnpm ai:validate`.
6. Zakończ blokiem `done:` z `core.md`.

## Nie

- Pomijać analysta gdy scope jest unclear.
- Bundlować unrelated cleanup do PR.
- Markować `done:` gdy jakikolwiek validator jest czerwony.
