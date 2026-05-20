---
id: rules.language
title: Preferencje językowe (PL domyślnie, EN dla nazw i toolingu)
type: rules
scope: trinity
priority: 2
version: 2.0.0
last-updated: 2026-05-20
trinity-baseline: true
---

# Preferencje językowe

> Trinity baseline. Reguła określa, **co piszemy po polsku**, a **co po angielsku** w trzech repo (`ai-studio`, `ai-mcp-alm`, `ai-mcp-devtools`) i pochodnych. Cel: maksymalna czytelność dla zespołu (PL) bez utraty interoperacyjności kodu i toolingu (EN).
>
> **Zmiana w v2.0.0** (2026-05-20): polski stał się domyślnym językiem dla wszystkich plików tekstowych z prozą (README, CONTRIBUTING, SECURITY, CLAUDE.md, AGENTS.md, `.ai/*`, `.github/copilot-*`). Angielski pozostaje tylko dla nazw i powierzchni czytanych przez tooling.

## Reguła kciuka

> _**Czy to nazwa / identyfikator / czytane przez tooling (git, CI, LLM przy `list_tools`, monitoring JSON)?**_ → **English**.
> _**Wszystko inne (proza, instrukcje, uzasadnienia, opisy dla człowieka)**_ → **Polski**.

## Domyślne ustawienie

| Powierzchnia                                             | Język   | Dlaczego                                                                           |
| -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| **Czat z Claude / Copilot**                              | polski  | Preferencja użytkownika; szybsze reasoning po stronie zespołu                      |
| `README.md`, `CONTRIBUTING.md`, `SECURITY.md`            | polski  | Czytane przez zespół + ewentualnych kontrybutorów PL                               |
| `CLAUDE.md`, `AGENTS.md`                                 | polski  | Czytane przez agentów (Claude Code · Copilot rozumieją PL); kontekst dla człowieka |
| `docs/technical/`, `docs/architecture/`, `docs/adr/`     | polski  | Czytane przez tester · dev · devops · architekta                                   |
| `docs/analytical/specs/<slug>/*.md`                      | polski  | SDD — domena biznesowa, uzasadnienia                                               |
| `docs/ai-workflow/plans/`, `docs/ai-workflow/runs/`      | polski  | Plany i logi przebiegów dla zespołu                                                |
| `CHANGELOG.md`, `PLAN.md`                                | polski  | Notki dla zespołu                                                                  |
| `.ai/README.md`, `.ai/architecture.md`                   | polski  | Proza w nawigacji `.ai/` — wskaźniki dla agentów rozumieją PL                      |
| `.ai/rules/*.md` (proza, oprócz tożsamości baseline)     | polski  | Proza reguł — identyfikatory/nazwy zostają EN                                      |
| `.ai/agents/*.md`, `.ai/workflows/*.md`                  | polski  | Definicje ról i procesów — proza PL                                                |
| `.ai/prompts/*.md`, `.ai/context/*.md`                   | polski  | Templatki promptów i glossary domenowy                                             |
| `.github/copilot-instructions.md` (proza)                | polski  | Czytana przez Copilot Chat (Copilot rozumie PL); spójność z `CLAUDE.md`            |
| `.github/instructions/*.instructions.md` (proza)         | polski  | Mirror `.ai/rules/` po PL; `applyTo:` globy pozostają EN                           |
| `.github/prompts/*.prompt.md` (proza)                    | polski  | Mirror `.ai/prompts/`                                                              |
| `.github/chatmodes/*.chatmode.md` (proza)                | polski  | Chat modes domain — proza PL                                                       |
| `.github/ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE`       | polski  | Wypełniane przez zespół PL                                                         |
| **Code (TS/JS/HTML/SCSS)** — identyfikatory, sygnatury   | english | Międzynarodowy standard, AI tokenizer, OSS                                         |
| Komentarze inline w kodzie + JSDoc                       | english | Spójność z kodem; AI tooling lepiej tokenizuje                                     |
| Test names (`it('should ...')`), fixture data            | english | Czytane przez CI raportery, snapshot diffs                                         |
| MCP tool `description`, parametry schema (Zod itp.)      | english | Wysyłane do LLM przy każdym `list_tools` — token cost                              |
| Komunikaty błędów (`Error`, `throw`), log entries        | english | Konsumowane przez monitoring JSON, alerty                                          |
| Git: branch · commit · PR title · PR body                | english | Conventional Commits, commitlint, automatyzacja, OSS-friendly                      |
| `package.json` fields (`name`, `description`, scripts)   | english | Czytane przez npm registry i automation                                            |
| Frontmatter keys (`id:`, `type:`, `scope:`, `priority:`) | english | Identyfikatory schema — czytane przez walidator                                    |
| `LICENSE`                                                | english | Wymóg licencji (czytany przez audytorów spoza zespołu)                             |

## Dlaczego ten podział

- **Tooling-readable surfaces pozostają EN.** Git/CI/LLM tokenizer/monitoring są skuteczniejsze i przewidywalniejsze gdy widzą EN.
- **Proza dla człowieka po PL.** Zespół myśli i pracuje po polsku — translacja kontekstu biznesowego na EN to cognitive load + ryzyko błędów tłumaczeniowych.
- **MCP `description` to wyjątek krytyczny** — wysyłany do LLM przy każdym `list_tools`. Token cost mnoży się przy każdym tool call. Zostaje EN.
- **`LICENSE` EN** — wymóg licencyjny + czytany przez audytorów spoza zespołu.
- **Frontmatter keys** to schema — walidator parsuje po nazwie pola.

## Przykłady

```text
docs/technical/pong-game.md                                                    # PL — czytane przez tester/dev/devops
apps/pong-game/src/app/pong-host.component.ts                                  # EN — kod + JSDoc + identyfikatory
docs/analytical/specs/2026-05-08-pong-game/spec.md                             # PL — faza 1 SDD
git commit "feat(app): pong game built via spec-driven development"            # EN — Conventional Commits
git branch "feat/pong-game-bootstrap"                                          # EN
CLAUDE.md                                                                      # PL — proza wskaźnik
.ai/rules/core.md                                                              # PL — proza reguł (identyfikatory EN)
.ai/architecture.md                                                            # PL — proza architektury
README.md                                                                      # PL — intro/quickstart dla zespołu PL
.github/copilot-instructions.md                                                # PL — proza wskaźnik dla Copilot
LICENSE                                                                        # EN — wymóg licencji
package.json (description, scripts)                                            # EN — npm registry
```

## Pliki mieszane

Unikaj wieloblokowych mieszanek. Akceptowalne:

- ✅ Polski tekst + angielskie bloki kodu / JSDoc / komendy CLI
- ✅ Polski tekst + angielskie nazwy plików, identyfikatory, ścieżki, `applyTo:` globy w backtickach
- ✅ Polskie tabele + angielskie wartości w komórkach gdy są nazwami
- ❌ Naprzemienne akapity PL/EN — zrefactoruj na jeden język

## Migracja v1 → v2 (2026-05-20)

- **v1 (do 2026-05-19):** README, CONTRIBUTING, SECURITY, CLAUDE.md, AGENTS.md, `.ai/rules/*` (proza), `.ai/agents/*`, `.ai/workflows/*`, `.github/copilot-*` były po EN.
- **v2 (od 2026-05-20):** wszystkie te powierzchnie migrowane na PL prozę. Iteracja v0.2 w `ai-workspace` koordynuje retranslację cross-repo.
- **Strategia:** reguła obowiązuje dla **nowych** plików natychmiast. Istniejące pliki migrowane partiami przy okazji refactorów per repo. Pełny rewrite EN → PL nie jest blokerem wydania v2.
- **Trinity baseline w `.ai/rules/*` (`core.md`, `principles.md`, `security.md`, `production-readiness.md`, `llm-optimization.md`, ten plik):** pozostają **byte-identical** w 3 repo. Retranslacja musi iść w jednej iteracji we wszystkich członkach.

## Notatka dla agentów (Claude Code · GitHub Copilot)

W obrębie repo `C:\github\*` (rodzina `ai-*`):

1. **Domyślny język czatu:** polski. Odpowiadaj po polsku, dopóki użytkownik nie poprosi inaczej.
2. **Język kodu, gita, tool-call'i, MCP `description`:** angielski.
3. **Język nowych plików dokumentacji / wskaźników (CLAUDE.md, README.md, AGENTS.md, `.ai/*` proza):** polski (per tabela powyżej).
4. **Język identyfikatorów (frontmatter keys, frontmatter values gdy są identyfikatorami, `applyTo:` globy, package.json fields):** angielski.
5. Gdy nie masz pewności — pytaj użytkownika lub stosuj regułę kciuka.

## Dlaczego ten plik jest po polsku

Wyjątek do reguły "trinity baseline po angielsku" (historycznie): `language.md` _**jest**_ regułą językową. Napisanie jej po polsku to spójność wewnętrzna (rule eats its own dogfood). Wszystkie odwołania do plików, kluczy, narzędzi i komend pozostają w angielskich oryginałach (per reguła "nazwy zostają EN").
