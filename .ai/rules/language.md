---
id: rules.language
title: Preferencje językowe (PL/EN split)
type: rules
scope: trinity
priority: 2
version: 1.0.0
last-updated: 2026-05-09
trinity-baseline: true
---

# Preferencje językowe

> Trinity baseline. Reguła określa, co piszemy po **polsku**, a co po **angielsku** w trzech repo (`ai-studio`, `ai-mcp-alm`, `ai-mcp-devtools`). Cel: czytelność dla zespołu (PL) bez utraty interoperacyjności kodu i toolingu (EN).

## Domyślne ustawienie

| Powierzchnia                                        | Język   | Dlaczego                                                      |
| --------------------------------------------------- | ------- | ------------------------------------------------------------- |
| **Czat z Claude / Copilot**                         | polski  | Preferencja użytkownika; szybsze reasoning po stronie zespołu |
| `docs/technical/`                                   | polski  | Czytane przez tester · dev · devops · admin                   |
| `docs/architecture/`                                | polski  | Czytane przez architekta + reviewerów                         |
| `docs/analytical/specs/<slug>/spec.md`              | polski  | Faza 1 SDD (analityk) — domena biznesowa                      |
| `docs/analytical/specs/<slug>/plan.md`              | polski  | Faza 2 SDD (architekt) — uzasadnienia w PL                    |
| `docs/analytical/specs/<slug>/tasks.md`             | polski  | DAG + opisy                                                   |
| `docs/ai-workflow/plans/`                           | polski  | Plany — uzasadnienia po polsku                                |
| `docs/ai-workflow/runs/`                            | polski  | Logi przebiegów                                               |
| `docs/adr/`                                         | polski  | Architecture Decision Records (kontekst + uzasadnienie)       |
| `CHANGELOG.md`                                      | polski  | Notki dla zespołu                                             |
| **Code (TS/JS/HTML/SCSS)**                          | english | Międzynarodowy standard, narzędzia tokenizera, OSS            |
| Komentarze w kodzie + JSDoc                         | english | Spójność z kodem; AI tooling lepiej tokenizuje                |
| Test names, fixture data                            | english | Czytane przez CI raportery                                    |
| MCP tool `description`                              | english | Wysyłane do LLM przy każdym `list_tools` — token cost         |
| Komunikaty błędów (Error · throw)                   | english | Logi po EN, konsumowane przez monitoring                      |
| Wpisy logów (`log.ts`)                              | english | Zgodność z monitoringiem JSON                                 |
| Git: branch · commit · PR title · PR body           | english | Conventional Commits, commitlint, automatyzacja, OSS-friendly |
| `.ai/rules/` (oprócz tego pliku)                    | english | Spójność z toolingiem agentowym                               |
| `.ai/agents/`                                       | english | Spójność z toolingiem agentowym                               |
| `.ai/workflows/`                                    | english | Spójność z toolingiem agentowym                               |
| `README.md` (intro/quickstart)                      | english | OSS audience na GitHubie; międzynarodowi kontrybutorzy        |
| `SECURITY.md`                                       | english | Czytane przez audytorów spoza zespołu                         |
| `CONTRIBUTING.md`                                   | english | OSS audience                                                  |
| `LICENSE`                                           | english | Wymóg licencji                                                |
| `.github/copilot-instructions.md`                   | english | Czytane przez Copilot Chat                                    |
| `CLAUDE.md`                                         | english | Czytane przez Claude Code (agent file)                        |
| `.github/ISSUE_TEMPLATE/` · `PULL_REQUEST_TEMPLATE` | english | Wypełniane też przez OSS contributors                         |

## Reguła kciuka

> _**Czy LLM / git / CI to przeczyta?**_ → **English**.
> _**Czy zespół przeczyta to dla kontekstu lub uzasadnienia?**_ → **Polish**.

## Dlaczego ten podział

- **Kod portable.** Międzynarodowi kontrybutorzy, OSS, AI tooling.
- **Docs dla zespołu.** Polski redukuje cognitive load i błędy tłumaczenia w domenie biznesowej.
- **Git po angielsku.** Bo Conventional Commits + commitlint + downstream tooling.
- **Specy i plany po polsku.** Bo to język rozumowania biznesowego — analityk pisze po polsku, architekt uzasadnia po polsku.

## Przykłady

```
docs/technical/pong-game.md                                                    # PL — czytane przez tester/dev/devops
apps/pong-game/src/app/pong-host.component.ts                                  # EN — kod + JSDoc
docs/analytical/specs/2026-05-08-pong-game/spec.md                             # PL — faza 1 SDD
git commit "feat(app): pong game built via spec-driven development"            # EN — Conventional Commits
git branch "feat/pong-game-bootstrap"                                          # EN
.ai/rules/language.md                                                          # PL — wyjątek: ten plik wyjaśnia regułę po PL
.ai/architecture.md                                                            # EN — agent-readable, trinity baseline
README.md (intro)                                                              # EN — OSS quickstart
```

## Pliki mieszane

Unikaj wieloblokowych mieszanek. Akceptowalne:

- ✅ Polski tekst + angielskie bloki kodu / JSDoc / komendy CLI
- ✅ Polski tekst + angielskie nazwy plików w backtickach
- ❌ Naprzemienne akapity PL/EN — zrefactoruj na jeden język

## Migracja

- **Istniejące dokumenty po angielsku zostają.** Reguła obowiązuje dla **nowych** dokumentów.
- Trinity baseline (`.ai/rules/{core,principles,security,production-readiness}.md`, `.ai/architecture.md`, `.ai/agents/orchestrator.md`, `.ai/workflows/spec-driven.md`, `bootstrap.mjs`, `_template.md`) **zostaje po angielsku** — pliki cross-repo czytane przez tooling.
- Gdy refactorujesz dokument tech/projektowy, możesz przy okazji przetłumaczyć — nie obowiązkowo.

## Notatka dla agentów (Claude Code · GitHub Copilot)

W obrębie tych repo:

1. **Domyślny język czatu:** polski. Odpowiadaj po polsku, dopóki użytkownik nie poprosi inaczej.
2. **Język kodu, gita i tool-call'i:** angielski.
3. **Język nowych dokumentów technicznych / projektowych:** polski (per tabela powyżej).
4. **Język plików `.ai/rules/`, `.ai/agents/`, `.ai/workflows/`:** angielski (trinity-shared).
5. Gdy nie masz pewności — pytaj użytkownika.

## Dlaczego ten plik jest po polsku

Wyjątek do reguły "trinity baseline po angielsku": `language.md` _**jest**_ regułą językową. Napisanie jej po polsku to spójność wewnętrzna (rule eats its own dogfood) + zwięzłe uzasadnienie po polsku dla zespołu. Wszystkie odwołania do plików, kluczy, narzędzi i komend pozostają w angielskich oryginałach (per reguła "code stays English").
