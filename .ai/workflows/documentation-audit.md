---
id: workflow.documentation-audit
title: Documentation audit
type: workflow
trigger: 'scheduled (monthly) OR docs drift suspected OR wywołane `audit-docs`'
owner: orchestrator
version: 2.0.0
---

# Workflow: Documentation audit

Zamyka loop między kodem a docs. Produkuje **raport**, potem opcjonalnie **regeneruje** docs z raportu i **wyprowadza** E2E scenariusze z affected specs.

```mermaid
flowchart LR
    T([Trigger]) --> O[Orchestrator]
    O --> S[Scanners (deterministic)]
    S -->|tmp/docs-scan.json<br/>tmp/public-api.json| DA[Doc Auditor]
    DA -->|tmp/doc-audit-DATE.md| O
    O --> Decide{Findings?}
    Decide -- must-fix --> RG[Regenerate docs]
    Decide -- AC-affecting --> SC[Scenario Author]
    RG --> DW[Doc Writer]
    SC --> TE[Test Engineer]
    DW & TE --> CR[Code Reviewer]
    CR --> O
    O --> U([Done / Issues opened])
```

## Kroki

### 0. Plan

Jeśli audit produkuje ≥ 1 must-fix lub jakakolwiek regeneracja jest wymagana, Orchestrator tworzy `docs/ai-workflow/plans/<YYYY-MM-DD>-doc-audit-<slug>.md` z templatu zanim deleguje do doc-writer lub test-scenario-author. Plan tasks referencjonują audit report path pod `inputs:`. Read-only audit run (bez regeneracji) jest exempt — sam raport jest deliverablem.

### 1. Scan (deterministic, no LLM)

Orchestrator uruchamia:

```bash
pnpm docs:scan       # → tmp/docs-scan.json     (każdy md plik, frontmatter, headings, links)
pnpm docs:api        # → tmp/public-api.json    (każdy export z libs/* i apps/*)
pnpm docs:audit      # → tmp/doc-audit-<date>.md (combined report)
```

Done gdy trzy artefakty istnieją.

### 2. Triage (Doc Auditor)

Orchestrator deleguje do **doc-auditor**. Auditor:

- Reads `tmp/doc-audit-<date>.md`.
- Weryfikuje must-fix findings przeciw touched code (żadnego rewrite bez weryfikacji).
- Emituje blok `audit:` YAML z klasyfikowanymi findings.

### 3. Decide

Orchestrator inspectuje verdict:

| Findings present                                   | Dalej                                                 |
| -------------------------------------------------- | ----------------------------------------------------- |
| Tylko nice-to-have                                 | Otwórz jedno issue tagged `type:docs`; close workflow |
| Must-fix lub should-fix                            | Continue do kroku 4                                   |
| Spec drift (AC odzwierciedlone w spec ale nie E2E) | Też continue do kroku 5                               |

### 4. Regenerate (Doc Writer)

Doc-writer przepisuje affected pages, cytując audit ids w opisie PR. Doc-auditor re-runs `pnpm docs:audit` i potwierdza delta.

### 5. Refresh scenarios (Scenario Author + Test Engineer)

Jeśli specs touched w kroku 4 zawierają Given/When/Then, uruchom:

```bash
pnpm test:scenarios
```

Scenario-author przenosi nowe skeletons do `apps/<app>-e2e/src/specs/`. Test-engineer wypełnia fixtures i assertions. Orchestrator uruchamia `pnpm exec nx affected -t e2e`.

### 6. Review

Code-reviewer pass na docs+tests PR. Żaden security-auditor potrzebny chyba że audit ujawnił security-doc drift.

### 7. Wrap

Orchestrator emituje finalny blok `done:` z:

- Audit report path.
- Issues otwarte lub PR zmergowany (z delta).
- New / updated scenarios run summary.

## Cadence

- **Monthly** scheduled run (GitHub Actions cron — patrz `.github/workflows/docs-audit.yml`).
- **Ad-hoc** przez slash command `audit-docs` / Copilot prompt.
- **On-demand** gdy Orchestrator wykryje doc lint failure na nieskorelowanym PR.

## Anti-patterns

- ❌ Przepisywanie docs bez najpierw przeczytania touched code.
- ❌ Bundlowanie doc rewrites z feature work.
- ❌ Generowanie dziesiątek micro-issues — grupuj wg area / library.
- ❌ Usuwanie docs, które okażą się złe — oznacz `Status: superseded` i linkuj replacement.
