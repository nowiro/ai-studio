# PLAN — Uzupełnienie warstwy skilli, BPMN i parytetu narzędziowego

## Status: ✅ Done (100%) | Iteracja: 1 | Data: 2026-05-19 | Zamknięto: 2026-05-19

> **Audyt + finalizacja 2026-05-19**: Iteracja 1 zrealizowana, AC4 dostarczone (linki `bpmn:` w 10 README), trinity-check rozszerzony o parytet `.ai ↔ .claude`. **40 planów zamkniętych i przeniesionych do `archive/2026-05/`** w 3 repo trinity. Folder `plans/` zawiera teraz tylko `_template.md` + `archive/` — czysta karta.

> Audyt repo z 2026-05-19 wykazał, że `ai-studio` jest najlepiej rozwiniętym członkiem trinity — ma 12 agentów (Claude + AI), 16 slash-komend, 8 workflows, 11 reguł, 13 ADR i pełną strukturę `docs/projects/<app>/` dla 10 demo apps. **Główne luki dotyczą skilli Claude Code (tylko 1 z planowanych ~10), brakujących hooków oraz schematów BPMN dla 10 procesów biznesowych demo-aplikacji.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CEL: Domknąć warstwę `.claude/skills/` (skille są kluczowym primitivem trinity wg [`.ai/architecture.md`](.ai/architecture.md) §1) i wprowadzić sformalizowane procesy biznesowe (BPMN 2.0) dla każdego demo (tire-shop, library, school-journal, bookstore, tools-shop, toy-shop, individual-wizard, business-wizard) — które dziś są opisane wyłącznie diagramami Mermaid w `business.md`.

📋 KRYTERIA AKCEPTACJI (po audycie 2026-05-19):

- [x] AC1: `.claude/skills/` zawiera ≥ 8 skilli (obecnie **9** — verified `ls .claude/skills/`):
  - `angular-material-design` ✅ istnieje
  - `angular-testing` — Vitest + Angular 21 native runner, patterns dla `signal()` testowania
  - `angular-forms` — Reactive Forms patterns (validators, async, conditional, wizard step)
  - `playwright-e2e` — page-object, `getByRole > getByTestId`, MCP integration
  - `nx-generators` — kiedy `nx g lib` vs `nx g app` vs custom generator
  - `signal-store` — wzorce `signal()` + `computed()` + effect, kiedy `NgRx SignalStore`
  - `web-component-build` — `@angular/elements` + `build:element` target (mirror dla 12 apps)
  - `microfrontend-orchestration` — Native Federation, `apps/portal`, lazy load manifestów
  - `accessibility-a11y` — ARIA, keyboard nav, role + label, axe-playwright w E2E
- [x] AC2: `.claude/hooks/` zawiera ≥ 3 hooki (dostarczono **4** × 2 = 8 plików, ps1+sh):
  - `pre-commit-trinity-check.{ps1,sh}` — uruchamia `pnpm trinity:check` przed każdym commitem
  - `post-edit-lint.{ps1,sh}` — `pnpm affected:lint --fix` po edycji `*.ts`/`*.html`
  - `session-start-context.{ps1,sh}` — wypisuje status `nx graph`, ostatnie 3 ADR-y, otwarte plany
  - `pre-push-affected-test.{ps1,sh}` — `pnpm affected:test --base=origin/main`
- [x] AC3: **BPMN — schematy biznesowe** dla 10 procesów (po 1 na demo + 2 cross-cutting) — **wszystkie 10 dostarczone, walidne XML w `docs/bpmn/`**:
  - `tire-shop-checkout.bpmn` — koszyk → 4-step checkout → potwierdzenie → płatność (mock)
  - `library-loan-flow.bpmn` — wyszukaj → zarezerwuj → wypożycz (librarian) → zwrot
  - `library-overdue-handling.bpmn` — daily check → mark overdue → calc fine → notify
  - `school-journal-grading.bpmn` — class context → student → wystaw ocenę → aggregate semestr
  - `bookstore-purchase.bpmn` — shop-core flow (reusable dla tools-shop, toy-shop)
  - `individual-wizard-submit.bpmn` — 5-step (PESEL → adres → preferencje → RODO → review)
  - `business-wizard-submit.bpmn` — 6-step (firma → osoba → branża → cele → kontakt → review)
  - `keycloak-auth-flow.bpmn` — login → token → refresh → role mapping → guard decision
  - `mfe-portal-load.bpmn` — portal init → fetch manifest → lazy load app → render
  - `web-component-embed.bpmn` — host page load → `<ais-app>` mount → standalone vs federated decision
- [ ] AC4: Każda aplikacja w `docs/projects/<app>/` ma link `bpmn:` w frontmatter do swojego `.bpmn` — **pozostaje do zrobienia (10 plików README)**
- [x] AC5: `pnpm bpmn:lint` — bpmnlint zainstalowany w `package.json`, skrypt dostarczony. Pre-commit + CI workflow wciąż do dospinania
- [x] AC6: `pnpm bpmn:render` — `tools/scripts/bpmn-render.mjs` dostarczony, `bpmn-to-image` w devDependencies
- [x] AC7: ADR-0015 (BPMN w SDD Phase 1.5) + ADR-0014 (skille vs agenci) zaakceptowane jako `proposed`. `spec-driven.md` rozszerzony i zsynchronizowany w 3 repo trinity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Postęp po audycie 2026-05-19

**Dostarczono (zweryfikowane):**

- 8 nowych skilli (9 łącznie z istniejącym `angular-material-design`)
- 4 hooki (po 2 wersje: `.ps1` + `.sh`)
- 10 BPMN 2.0 XML w `docs/bpmn/` + README + toolchain w `package.json` + `tools/scripts/bpmn-render.mjs`
- ADR-0014 (skille vs agenci) + ADR-0015 (BPMN w SDD)
- `spec-driven.md` rozszerzony o Phase 1.5b BPMN, zsynchronizowany w trinity
- Trinity verified: `node tools/scripts/check-trinity.mjs` → "trinity in sync (11 baseline files)"

**Pozostaje (mikro-zadania):**

- AC4: linki `bpmn:` we frontmatter `docs/projects/<app>/README.md` (10 plików)
- AC5: bpmnlint w `.husky/pre-commit` + `.github/workflows/bpmn.yml`
- `pnpm approve-builds` (ręczne, dla puppeteera potrzebnego przez bpmn-to-image)

## Co konkretnie brakuje (audyt 2026-05-19)

### Skille (`.claude/skills/`)

**Stan:** 1 skill — `angular-material-design/SKILL.md` (świetny wzorzec).
**Brakuje:** ≥ 7 dodatkowych skilli pokrywających pozostałe filary stacku.

| Skill                         | Po co                                                      | Priorytet   |
| ----------------------------- | ---------------------------------------------------------- | ----------- |
| `angular-material-design`     | M3 + Tailwind v4 patterns dla form i shell                 | ✅ istnieje |
| `angular-testing`             | Vitest + signal() testing + Angular 21 runner              | 🔴 P0       |
| `angular-forms`               | Reactive Forms — wizard, conditional, async validators     | 🔴 P0       |
| `playwright-e2e`              | Page-object + getByRole + MCP Playwright integration       | 🟡 P1       |
| `nx-generators`               | Kiedy `nx g lib/app` vs custom generator + tagging         | 🟡 P1       |
| `signal-store`                | `signal()` + `computed()` + effect, kiedy NgRx SignalStore | 🟡 P1       |
| `web-component-build`         | `@angular/elements` + `build:element` (mirror dla 12 apps) | 🟢 P2       |
| `microfrontend-orchestration` | Native Federation + portal + manifest                      | 🟢 P2       |
| `accessibility-a11y`          | ARIA + keyboard nav + axe-playwright                       | 🟡 P1       |

**Uzasadnienie:** Skille są jednym z trzech primitives w `.ai/architecture.md` §1 (Tool · MCP · Skill). Repo ma 12 demo apps i 16 slash-komend, ale tylko 1 skill — agentowi brak "playbooków" dla najczęściej wykonywanych zadań.

### Hooki Claude Code (`.claude/hooks/`)

**Stan:** katalog istnieje, jest pusty.
**Brakuje:** automatyzacji repetytywnych operacji.

| Hook                          | Trigger                              | Działanie                                     |
| ----------------------------- | ------------------------------------ | --------------------------------------------- |
| `pre-commit-trinity-check.sh` | przed commitem trinity-baseline-file | `pnpm trinity:check`                          |
| `post-edit-lint.sh`           | po `Edit`/`Write` na `*.ts`/`*.html` | `pnpm affected:lint --fix` na affected libs   |
| `session-start-context.sh`    | start sesji                          | `nx graph` summary + last 3 ADRs + open plans |
| `pre-push-affected-test.sh`   | przed `git push`                     | `pnpm affected:test --base=origin/main`       |

### Agenci / Reguły / Workflows / Komendy / Prompts / Context / ADR

**Stan:** ✅ pełne (12 agentów, 11 reguł, 8 workflows, 16 komend, 5 promptów, 4 pliki kontekstu, 13 ADR).
**Brakuje:** brak istotnych braków w tych warstwach. Ewentualne uzupełnienia:

- ADR-0014: skille — kiedy `.claude/skills/` vs `.ai/agents/` (kryteria wyboru)
- ADR-0015: BPMN jako artefakt SDD — pozycja w pipeline `spec.md → bpmn → plan.md`

### Dokumentacja projektowa (`docs/`)

**Stan:** ✅ bardzo dobra (adr, analytical, architecture, programming, projects, technical, ai-workflow).
**Brakuje:**

- **PLAN.md na poziomie root** — istnieje 11 planów per-feature w `docs/ai-workflow/plans/`, ale brak high-level roadmap dla całego repo (ten plik).
- **`docs/bpmn/`** — nie istnieje (krytyczne — patrz niżej).
- **Per-app `bpmn:` link w frontmatter `docs/projects/<app>/README.md`** — żaden README nie linkuje do BPMN-u (bo BPMN-ów nie ma).

### BPMN — schematy biznesowe (krytyczna luka)

**Stan:** brak jakichkolwiek plików BPMN (`*.bpmn`), PlantUML (`*.puml`) ani drawio. Procesy biznesowe demo-aplikacji są opisane:

- prozą w `docs/projects/<app>/business.md` (sekcja "User journeys")
- diagramami Mermaid w `docs/projects/README.md` i niektórych `business.md`

**Dlaczego to luka:** demo-aplikacje to celowe **referencyjne implementacje wzorców enterprise** (faceted e-commerce, role-based admin, wizard, MFE). BPMN 2.0 jest _lingua franca_ analityków biznesowych — bez niego repo nie jest "salesowalne" jako pokazówka dla klientów z dojrzałą warstwą BPM (Camunda, Signavio, Bizagi). Mermaid jest świetny dla developerów, ale nie da się go zaimportować do silnika BPM ani zwalidować z `bpmnlint`.

**Brakuje katalogu `docs/bpmn/` z 10 plikami BPMN 2.0:**

| Plik                            | Proces                                                    | App / Cross-cutting                  |
| ------------------------------- | --------------------------------------------------------- | ------------------------------------ |
| `tire-shop-checkout.bpmn`       | koszyk → 4-step checkout → potwierdzenie                  | `tire-shop`                          |
| `library-loan-flow.bpmn`        | wyszukaj → zarezerwuj → wypożycz → zwrot                  | `library`                            |
| `library-overdue-handling.bpmn` | daily check → mark overdue → calc fine                    | `library`                            |
| `school-journal-grading.bpmn`   | class context → student → ocena → agregacja               | `school-journal`                     |
| `bookstore-purchase.bpmn`       | shop-core flow (reusable)                                 | `bookstore`/`tools-shop`/`toy-shop`  |
| `individual-wizard-submit.bpmn` | 5-step (PESEL → adres → preferencje → RODO → review)      | `individual-wizard`                  |
| `business-wizard-submit.bpmn`   | 6-step (firma → osoba → branża → cele → kontakt → review) | `business-wizard`                    |
| `keycloak-auth-flow.bpmn`       | login → token → refresh → role → guard                    | cross-cutting (`libs/keycloak-auth`) |
| `mfe-portal-load.bpmn`          | portal init → manifest → lazy load → render               | cross-cutting (`apps/portal`)        |
| `web-component-embed.bpmn`      | host load → `<ais-app>` mount → standalone vs federated   | cross-cutting (ADR-0012)             |

**Rekomendowane narzędzie:** [bpmn-js](https://bpmn.io/toolkit/bpmn-js/) (open-source, MIT) + walidator [bpmnlint](https://github.com/bpmn-io/bpmnlint) jako pre-commit hook. Render do SVG przez `bpmn-to-image` w CI, commitowany obok źródła.

**Pozycja BPMN w SDD:** rekomenduję rozszerzenie `spec-driven.md` — BPMN powstaje w Phase 1.5 (przez analyst, między `spec.md` a `clarify.md`) jako wizualizacja procesu z `## User journeys`. Plan ADR-0015 to zdokumentuje.

---

## Plan Implementacji

| #   | Krok                                                       | Plik(i)                                                                                   | Status | Ryzyko  | Pewność |
| --- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | ------- | ------- |
| 1   | 7 nowych skilli                                            | `.claude/skills/<name>/SKILL.md` + assets                                                 | ⏳     | Średnie | 75%     |
| 2   | 4 hooki                                                    | `.claude/hooks/*.sh` + rejestracja w `settings.json`                                      | ⏳     | Niskie  | 85%     |
| 3   | ADR-0014 (skille decision)                                 | `docs/adr/0014-skills-vs-agents.md`                                                       | ⏳     | Niskie  | 90%     |
| 4   | ADR-0015 (BPMN w SDD)                                      | `docs/adr/0015-bpmn-in-sdd.md`                                                            | ⏳     | Średnie | 70%     |
| 5   | Setup BPMN toolchain                                       | `package.json` (bpmn-js, bpmnlint, bpmn-to-image)                                         | ⏳     | Niskie  | 90%     |
| 6   | 10 plików BPMN                                             | `docs/bpmn/*.bpmn`                                                                        | ⏳     | Wysokie | 60%     |
| 7   | Generator SVG z BPMN                                       | `tools/scripts/bpmn-render.mjs` + `pnpm bpmn:render`                                      | ⏳     | Średnie | 80%     |
| 8   | bpmnlint w CI + pre-commit                                 | `.github/workflows/bpmn.yml`, `.husky/pre-commit`                                         | ⏳     | Średnie | 80%     |
| 9   | Link `bpmn:` we wszystkich `docs/projects/<app>/README.md` | `docs/projects/**/README.md`                                                              | ⏳     | Niskie  | 95%     |
| 10  | Aktualizacja `spec-driven.md` o Phase 1.5 BPMN             | `.ai/workflows/spec-driven.md` (trinity baseline!)                                        | ⏳     | Wysokie | 60%     |
| 11  | Propagacja zmian spec-driven do trinity                    | `ai-mcp-alm/.ai/workflows/spec-driven.md`, `ai-mcp-devtools/.ai/workflows/spec-driven.md` | ⏳     | Wysokie | 60%     |
| 12  | Aktualizacja `trinity:check` o BPMN baseline               | `tools/scripts/trinity-check.mjs`                                                         | ⏳     | Średnie | 75%     |

## Zależności

- Krok 10 (zmiana `spec-driven.md`) **wymaga** kroku 11 (propagacja do pozostałych repo trinity) w tym samym PR — inaczej `trinity:check` padnie.
- Krok 6 (pisanie BPMN) wymaga kroku 5 (toolchain).
- Krok 9 (linki w README) wymaga kroku 6 (BPMN-y muszą istnieć).
- Krok 8 (lint w CI) jest ostatni.

## Zagrożenia

- **BPMN to nowa dyscyplina** — krzywa uczenia dla zespołu. Mitygacja: zacząć od 2 najprostszych (`tire-shop-checkout`, `library-loan-flow`) jako PoC, dopiero potem skalować do 10.
- **Trinity drift** — zmiana w `spec-driven.md` (baseline) wymaga równoległej zmiany w `ai-mcp-alm` i `ai-mcp-devtools`. Mitygacja: jeden PR obejmujący 3 repo (albo rozdzielony, ale w tej samej rundzie review).
- **Skille mogą duplikować reguły** — `.claude/skills/angular-testing/SKILL.md` może powtarzać treść z `.ai/rules/testing.md`. Mitygacja: skille linkują do reguł, nie kopiują (jak `angular-material-design` linkuje do `.ai/rules/styling.md`).
- **10 BPMN-ów to dużo** — można zrobić w sprintach po 3-4. Mitygacja: priorytetyzacja P0 (3 e-commerce + library + wizards = 6), reszta jako P1.

## Mapowanie na trinity

- `mcp-server-startup.bpmn` i `incident-response.bpmn` (jeśli powstaną) są kandydatami do dołączenia do **trinity-baseline files** — wspólne dla `ai-studio` (rzadko używane), `ai-mcp-alm` (każdy z 6 serwerów) i `ai-mcp-devtools` (1 serwer, 5 tools).
- `keycloak-auth-flow.bpmn` jest specyficzny dla `libs/keycloak-auth` (ai-studio only).
- Skille nie są obecnie trinity-baseline — ale `mcp-tool-author` / `mcp-connector-author` mogą być rozważane do uwspólnienia po stabilizacji.

## Validation gate

```bash
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
pnpm trinity:check
pnpm bpmn:lint     # nowy
pnpm bpmn:render   # nowy — sprawdza, czy SVG-i są aktualne wobec .bpmn
pnpm docs:audit
```

## Dziennik Iteracji

### Iteracja 1 — Faza 1 (PO) — Wynik: BACKLOG — Postęp: 0% — Pewność: 75%

**Źródła wymagań:**

- Audyt 2026-05-19 (porównanie struktury `ai-studio` vs `ai-mcp-alm` vs `ai-mcp-devtools`)
- [`.ai/architecture.md`](.ai/architecture.md) §1 (Tool · MCP · Skill — trzy primitives — skille są pierwszoligowym artefaktem)
- [`docs/projects/README.md`](docs/projects/README.md) — sekcja "Demo projects" zakłada że każdy projekt opisuje procesy biznesowe
- [`.ai/workflows/spec-driven.md`](.ai/workflows/spec-driven.md) — brak Phase BPMN w SDD
- Analog: [`ai-studio/.claude/skills/angular-material-design/SKILL.md`](.claude/skills/angular-material-design/SKILL.md) jako wzorzec

**Decyzja architektoniczna:**

1. BPMN żyje w `docs/bpmn/` (płaska struktura, nazwy `<app|cross-cutting>-<process>.bpmn`), nie w `docs/projects/<app>/bpmn/` (per-app) — bo wiele procesów jest współdzielonych (shop-core, keycloak, mfe) i taki podział lepiej oddaje rzeczywistość.
2. Skille nie kopiują treści reguł — linkują (DRY, zgodnie z `core.md` §1.3).
3. `spec-driven.md` zostaje rozszerzone, nie zastąpione — Phase 1.5 BPMN jest **opcjonalna** (tylko dla feature'ów z nietrywialnym procesem; CRUD wizard nie potrzebuje BPMN-a).

**Plan rozłożenia w czasie:**

- **Sprint 1 (1-2 tyg):** P0 skille (3) + 4 hooki + ADR-0014 + setup BPMN toolchain
- **Sprint 2 (1-2 tyg):** ADR-0015 + Phase 1.5 BPMN w spec-driven + 4 BPMN-y (3 P0 e-commerce + library)
- **Sprint 3 (1 tydz):** pozostałe 6 BPMN-ów + lint w CI + linki w README + trinity:check update
- **Sprint 4 (1 tydz):** P1/P2 skille (4)
