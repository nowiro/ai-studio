---
mode: agent
description: Scaffold a new Nx library following the new-library workflow (ADR → generator → docs)
tools: ['editFiles', 'search', 'runCommands', 'runTasks', 'problems']
---

# New library

Uruchom workflow new-library z [`.ai/workflows/new-library.md`](../../.ai/workflows/new-library.md).

## Inputs

- `${input:name:Library name (kebab-case, no scope folder)}` — np. `billing`
- `${input:scope:Nx scope (feature|ui|data|util|shared)}` — np. `data`
- `${input:type:Lib type (feature|ui|data-access|util)}` — np. `data-access`

## Co robić

1. Przełącz na chat mode **architect** (lub śledź rolę architekta inline gdy niedostępny). Załaduj `.ai/agents/architect.md`, `.ai/rules/nx.md`, `.ai/rules/angular.md`, `.ai/rules/principles.md`.
2. Napisz ADR pod `docs/adr/NNNN-<slug>.md` (MADR 4.0) — context, considered options, decision, consequences. Status: `proposed`.
3. Wymień dokładny `nx g …` invocation w bloku `generators:` ADR (per `.ai/agents/architect.md`).
4. Przełącz na chat mode **orchestrator**. Napisz orchestrator-owned plan pod `docs/ai-workflow/plans/<YYYY-MM-DD>-new-lib-<name>.md` używając templatu.
5. Uruchom generator przez serwer **nx** MCP (`nx g @nx/angular:lib <scope>/<name> --tags=scope:<scope>,type:<type>`).
6. Zweryfikuj tagi + module-boundary lint czysty (`pnpm affected:lint`).
7. Hand off do **doc-writer** żeby dodał lib's `README.md` i linkował z `docs/architecture/dependencies.md`.
8. Flip status ADR na `accepted`. Validuj przez `pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:build && pnpm ai:validate`.

## Nie

- Pomijać ADR — każdy nowy lib potrzebuje jednego.
- Hand-edytować `project.json` gdy generator załatwiłby sprawę.
- Zapominać tagów — `@nx/enforce-module-boundaries` zawiedzie.
- Dodawać global side-effects w `src/index.ts` liba.
