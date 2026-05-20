# CLAUDE.md — instrukcje dla Claude Code w tym repo

> Przeczytaj to **najpierw** w każdej sesji. Traktuj jako cienki wskaźnik na uniwersalną bazę wiedzy `.ai/`.

## Tożsamość

Pracujesz wewnątrz **AI Studio** — monorepo Angular Nx z multi-agentowym workflow AI.

## Pierwsze uruchomienie

```bash
pnpm install
pnpm bootstrap     # one-shot, idempotent — patrz README "Quickstart"
```

## Preferencje językowe

**Język czatu: polski.** Odpowiadaj użytkownikowi po polsku, dopóki nie poprosi inaczej.
**Kod, git, MCP tool `description`, powierzchnie czytane przez tooling: angielski.** Pełny podział PL/EN: [`.ai/rules/language.md`](.ai/rules/language.md) (trinity baseline v2.0.0 — proza PL · kod EN · git EN · MCP descriptions EN).

## Zawsze rób to na początku sesji

1. Przeczytaj [`.ai/README.md`](.ai/README.md) i [`.ai/architecture.md`](.ai/architecture.md) (kanoniczna referencja architektury AI nowiro — trinity baseline).
2. Przeczytaj każdy plik w [`.ai/rules/`](.ai/rules/). Są nienegocjowalne. Szczególnie [`core.md`](.ai/rules/core.md), [`principles.md`](.ai/rules/principles.md) (DRY, SOLID, KISS, YAGNI), [`production-readiness.md`](.ai/rules/production-readiness.md) (sześć must-haves przed wydaniem feature'a agentowego), [`language.md`](.ai/rules/language.md) (preferencje PL/EN) i [`llm-optimization.md`](.ai/rules/llm-optimization.md) (budżety tokenowe i kształt odpowiedzi).
3. Jeśli zadanie jest nietrywialne (≥ 3 kroki lub dotyka ≥ 2 pliki), spawnuj subagenta **orchestrator** i pozwól mu zaplanować.
4. Używaj serwerów MCP skonfigurowanych w `.claude/settings.json` i `.ai/mcp.json` (`context7`, `playwright`, `nx`, `angular-cli`, `memory`) zanim napiszesz kod dotykający external API.
5. Jeśli dotykasz jakiegokolwiek [pliku baseline trinity](docs/architecture/nowiro-projects-map.md#cross-cutting-invariants), uruchom `pnpm trinity:check` (wymuszane też na pre-push).

## Notatka cross-tool

To repo wspiera **zarówno Claude Code jak i GitHub Copilot** jako first-class targety — różne zespoły mają różne licencje. Mirror Copilot żyje pod [`.github/copilot-instructions.md`](.github/copilot-instructions.md), [`.github/instructions/`](.github/instructions/), [`.github/prompts/`](.github/prompts/) i [`.github/chatmodes/`](.github/chatmodes/). Gdy zmieniasz regułę lub agenta w `.ai/`, zaktualizuj obu wrapperów — `pnpm ai:validate` sprawdza parytet.

## Skille zewnętrzne

Kuratorowane skille third-party z <https://skills.sh/> komplementujące nasz stack są skatalogowane w [`.ai/external-skills.md`](.ai/external-skills.md). **Nic nie jest zainstalowane domyślnie** — katalog daje komendy `npx skillsadd <repo>` do instalacji per developer. Reguły projektu w `.ai/rules/` zawsze wygrywają gdy skill konfliktuje.

## Domyślny subagent

Gdy użytkownik daje nietrywialne żądanie, nie implementuj bezpośrednio — wywołaj:

```
Agent({ subagent_type: "orchestrator", prompt: <user request + context> })
```

Orchestrator deleguje do specjalistów. Agenci specjalistyczni są zdefiniowani pod [`.claude/agents/`](.claude/agents/) i [`.ai/agents/`](.ai/agents/).

## Twarde reguły (mirror `.ai/rules/core.md`)

- ✅ Czytaj kod zanim ogłosisz że go znasz.
- ✅ Najmniejsza rozsądna zmiana.
- ✅ Definition of Done = lint + typecheck + test + e2e + build wszystkie zielone, plus docs/ADR jeśli behaviour się zmienił.
- ✅ **Plan-first generation** — każda generacja kodu/docs/testów/scenariuszy przechodzi przez plan markdown wykonywany multi-agent delegacją (`.ai/rules/core.md` §7). Trywialne single-file edits zwolnione.
- ❌ Nigdy nie wymyślaj ścieżek plików, nazw funkcji, wersji pakietów.
- ❌ Nigdy nie bypassuj hooków (`--no-verify`).
- ❌ Nigdy nie umieszczaj sekretów w tracked files.

## Plan-first generation (`core.md` §7)

Dla wszystkiego co dotyka ≥ 2 pliki LUB zmienia behaviour, **orchestrator** pisze plan markdown PRZED delegacją:

| Typ zadania                                           | Plik planu                                      |
| ----------------------------------------------------- | ----------------------------------------------- |
| Spec-driven (flow `/specify`)                         | `docs/analytical/specs/<slug>/plan.md`          |
| Wszystko inne (bug, refactor, lib, docs, scenariusze) | `docs/ai-workflow/plans/<YYYY-MM-DD>-<slug>.md` |

Użyj [`docs/ai-workflow/plans/_template.md`](docs/ai-workflow/plans/_template.md) dla formy ownerowanej przez orchestratora. Specjaliści (frontend-developer, backend-developer, test-engineer, test-scenario-author, doc-writer) odrzucają delegacje których blok `delegate:` nie zawiera pól `plan:` + `task_id:`.

## Konwencje Angular

Stosuj [`.ai/rules/angular.md`](.ai/rules/angular.md) — zdestylowane z <https://angular.dev/ai>:

- Angular 21: standalone (implicit), OnPush, `inject()`, signal APIs.
- Native control flow (`@if`, `@for`, `@switch`, `@defer`).
- Wyłącznie reactive forms.
- `data-testid` na elementach interaktywnych.
- Prefix selektorów: `ais-` (komponenty) / `ais` (dyrektywy).
- Bez `*ngIf`, bez `[ngClass]`, bez `@HostBinding`, bez `console.*`.

## Styling (Material 3 + Tailwind v4)

Stosuj [`.ai/rules/styling.md`](.ai/rules/styling.md):

- Komponenty **Angular Material 3** (`mat-button`, `mat-form-field`, `mat-card`, …).
- **Utility Tailwind v4** dla layoutu / spacing / typografii; utility kolorów mapują na Material design tokens (`bg-primary`, `text-on-surface`, …).
- Bez `tailwind.config.js` — config żyje w `styles/tailwind.scss` pod `@theme`.
- Bez `::ng-deep`, bez `[ngClass]`, bez `[ngStyle]`.

## Konwencje Nx

Stosuj [`.ai/rules/nx.md`](.ai/rules/nx.md):

- `apps/*`, `libs/{feature,ui,data,util,shared}/*`.
- Taguj każdy projekt; module-boundary lint wymusza warstwowanie.
- Używaj generatorów (przez serwery MCP `nx` i `angular-cli`).
- Public API libów wyłącznie przez `src/index.ts`.

## Testowanie

Stosuj [`.ai/rules/testing.md`](.ai/rules/testing.md):

- **Vitest przez natywne Angular 21 `@angular/build:unit-test --runner=vitest`** — `@analogjs/vitest-angular` niepotrzebne. Adoptuj Analog tylko jeśli chcesz go jako meta-framework.
- Playwright dla E2E (chromium/firefox/webkit + mobile).
- Page-object pattern dla E2E. `getByRole` ▶ `getByTestId` ▶ CSS.

## Bezpieczeństwo

Stosuj [`.ai/rules/security.md`](.ai/rules/security.md):

- Nigdy nie shipuj API keys do klienta.
- Traktuj wszystkie outputy modelu jako untrusted text.
- Tool calls mutujące stan wymagają potwierdzenia human-in-the-loop.

## Workflows

Wybierz jeden z [`.ai/workflows/`](.ai/workflows/) gdy zadanie pasuje do jego triggera:

- `new-feature.md` — pełny multi-agent flow.
- `bug-fix.md` — najpierw failing test, najmniejszy fix, regression test.
- `refactor.md` — characterisation tests przypinają behaviour.
- `new-library.md` — generator + ADR + docs.
- `tech-debt.md` — scoped, measurable.
- `documentation-audit.md` — skanuj code+docs → raport → regenerate z raportu.
- `spec-driven.md` — fazowy flow SDD (`/specify` → `/clarify` → `/plan` → `/tasks` → `/implement`), zaadaptowany z [github/spec-kit](https://github.com/github/spec-kit) na naszych agentów.
- `incident-response.md` — speed > polish.

## Slash commands

Zdefiniowane pod [`.claude/commands/`](.claude/commands/) (bliźniaki pod [`.github/prompts/`](.github/prompts/) dla Copilot):

| Komenda                                | Co robi                                                        |
| -------------------------------------- | -------------------------------------------------------------- |
| `/new-feature <desc>`                  | pełny multi-agent new-feature flow                             |
| `/bug-fix <summary>`                   | failing test → najmniejszy fix → regression test               |
| `/new-library <name> <scope> <type>`   | scaffold nowego liba Nx przez workflow                         |
| `/review-pr <pr or branch>`            | code-reviewer + (gdy istotne) security-auditor                 |
| `/release [notes]`                     | `nx release` end-to-end                                        |
| `/sync-docs`                           | przebieg doc-writer po ostatnim release                        |
| `/migrate-doc <src> <tgt> <type>`      | przenieś jeden legacy doc do kanonicznego template             |
| `/audit-docs`                          | uruchom skanery → doc-auditor → otwórz issues                  |
| `/regenerate-docs`                     | przepisz docs z najnowszego raportu audytu                     |
| `/generate-test-scenarios [spec-slug]` | wyciągnij Given/When/Then → szkielety Playwright               |
| `/run-test-scenarios [grep]`           | uruchom E2E; przełącz na Playwright MCP dla live debug na fail |
| `/specify <desc>`                      | SDD faza 1 — analyst pisze `spec.md` (bez tech)                |
| `/clarify [slug]`                      | SDD faza 1.5 — rozwiąż markery `[?]` w `spec.md`               |
| `/plan [slug]`                         | SDD faza 2 — architect pisze `plan.md` + (jeśli trzeba) ADR    |
| `/tasks [slug]`                        | SDD faza 3 — orchestrator dekomponuje plan na DAG `tasks.md`   |
| `/implement [slug] [task\|all]`        | SDD faza 4 — orchestrator egzekutuje zadania + DoD gate        |

## Validation gate (przed raportowaniem Done)

```
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
```

Jeśli którykolwiek krok zawiedzie, **nie** jesteś done. Skieruj fail z powrotem do agenta produkującego lub do użytkownika.

## Format end-of-turn

Zawsze emituj jeden z:

```yaml
done:
  changes:
    - <path>:<one-line summary>
  validators: { lint: ✅, typecheck: ✅, test: ✅, e2e: ✅, build: ✅ }
  followups: [...]
```

```yaml
blocked:
  reason: <one line>
  needs:
    - <user decision | external service | missing input>
```

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
