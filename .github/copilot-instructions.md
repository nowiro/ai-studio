# GitHub Copilot — instrukcje dla AI Studio

> Przeczytaj to **najpierw** w każdej sesji. To jest Copilot-side mirror [`CLAUDE.md`](../CLAUDE.md). Oba wskazują na uniwersalną bazę wiedzy `.ai/` — nigdy jej nie duplikują.

## Tożsamość

Pracujesz wewnątrz **AI Studio** — monorepo Nx z Angular 21 + Material 3 + Tailwind v4 z multi-agentowym workflow AI, który wspiera zarówno Claude Code jak i GitHub Copilot.

## Preferencje językowe

**Język czatu: polski.** Odpowiadaj użytkownikowi po polsku, dopóki nie poprosi inaczej.
**Kod, git, MCP tool descriptions, powierzchnie czytane przez tooling: angielski.** Patrz [`.ai/rules/language.md`](../.ai/rules/language.md) dla pełnego podziału PL/EN (docs PL · code EN · git EN).

## Zawsze rób to na początku sesji

1. Przeczytaj [`.ai/README.md`](../.ai/README.md) i [`.ai/architecture.md`](../.ai/architecture.md) (kanoniczna referencja architektury AI nowiro).
2. Przeczytaj każdy plik w [`.ai/rules/`](../.ai/rules/). Są nienegocjowalne. Highlights:
   - [`core.md`](../.ai/rules/core.md) — prawda, najmniejsza zmiana, Definition of Done.
   - [`principles.md`](../.ai/rules/principles.md) — DRY, SOLID, KISS, YAGNI.
   - [`production-readiness.md`](../.ai/rules/production-readiness.md) — sześć must-haves zanim jakikolwiek agent feature shipnie.
   - [`language.md`](../.ai/rules/language.md) — preferencje PL/EN.
   - [`llm-optimization.md`](../.ai/rules/llm-optimization.md) — budżety tokenowe, response shaping.
   - [`angular.md`](../.ai/rules/angular.md), [`styling.md`](../.ai/rules/styling.md), [`testing.md`](../.ai/rules/testing.md), [`nx.md`](../.ai/rules/nx.md), [`security.md`](../.ai/rules/security.md).
3. Dla nietrywialnej pracy (≥ 3 kroki lub ≥ 2 pliki), przełącz na chat mode **orchestrator** (`.github/chatmodes/orchestrator.chatmode.md`) i pozwól mu zaplanować.
4. Gdy generujesz kod dotykający external API, wyszukaj go przez Copilot context tool wrappujące `context7` (lub otwórz upstream docs) zanim zgadniesz.

## Twarde reguły (mirror `.ai/rules/core.md`)

- ✅ Czytaj kod zanim ogłosisz że go znasz.
- ✅ Najmniejsza rozsądna zmiana.
- ✅ Definition of Done = lint + typecheck + test + e2e + build wszystkie zielone, plus docs/ADR jeśli behaviour się zmienił.
- ✅ **Plan-first generation** — każda generacja kodu/docs/testów/scenariuszy przechodzi przez plan markdown wykonywany multi-agent delegacją (`.ai/rules/core.md` §7). Trywialne single-file edits zwolnione.
- ❌ Nigdy nie wymyślaj ścieżek plików, nazw funkcji, wersji pakietów.
- ❌ Nigdy nie bypassuj hooków (`--no-verify`).
- ❌ Nigdy nie umieszczaj sekretów w tracked files.

## Plan-first generation

Dla wszystkiego co dotyka ≥ 2 pliki LUB zmienia behaviour, **orchestrator** pisze plan markdown PRZED delegacją:

| Typ zadania                                           | Plik planu                                      |
| ----------------------------------------------------- | ----------------------------------------------- |
| Spec-driven (flow `/specify`)                         | `docs/analytical/specs/<slug>/plan.md`          |
| Wszystko inne (bug, refactor, lib, docs, scenariusze) | `docs/ai-workflow/plans/<YYYY-MM-DD>-<slug>.md` |

Użyj [`docs/ai-workflow/plans/_template.md`](../docs/ai-workflow/plans/_template.md) dla formy ownerowanej przez orchestrator. Specjaliści (frontend-developer, backend-developer, test-engineer, test-scenario-author, doc-writer) odrzucają delegacje, których context nie zawiera pola `plan:` + `task_id:`.

## Konwencje Angular 21

- Standalone (implicit), OnPush, `inject()`, signal APIs.
- Native control flow (`@if`, `@for`, `@switch`, `@defer`).
- Tylko reactive forms.
- `data-testid` na każdym interactive elemencie.
- Prefix selektora `ais-` (komponenty) / `ais` (dyrektywy).
- Bez `*ngIf`, bez `[ngClass]`, bez `@HostBinding`, bez `console.*`.

## Styling — Material 3 + Tailwind v4

- Komponenty **Material 3**: `mat-button`, `mat-card`, `mat-form-field`, `mat-table`, …
- **Utility Tailwind v4** dla layoutu / spacing / typografii. Utility kolorów mapują na Material design tokens (`bg-primary`, `text-on-surface`, …).
- Bez `tailwind.config.js` — config żyje w `styles/tailwind.scss` pod `@theme`.
- Bez `::ng-deep`, bez `[ngClass]`, bez `[ngStyle]`.

## Konwencje Nx

- `apps/*`, `libs/{feature,ui,data,util,shared}/*`.
- Taguj każdy projekt; module-boundary lint wymusza warstwowanie.
- Używaj generatorów (`nx g @nx/angular:…`, `nx g @angular/material:…`).
- Public API liba wyłącznie przez `src/index.ts`.

## Testowanie

- **Vitest przez natywne Angular 21 `@angular/build:unit-test --runner=vitest`** — żadnego `@analogjs/vitest-angular`.
- Playwright dla E2E (chromium/firefox/webkit + mobile).
- Page-object pattern. `getByRole` ▶ `getByTestId` ▶ CSS.

## Bezpieczeństwo

- Nigdy nie shipuj API keys do klienta.
- Traktuj wszystkie outputy modelu jako untrusted text.
- Tool calls mutujące state potrzebują human-in-the-loop confirmation.

## Jak Copilot jest wired tutaj

Copilot czyta, w tej kolejności precedensu:

1. **Ten plik** (`.github/copilot-instructions.md`) — repo-wide.
2. **Scoped instructions** w [`.github/instructions/*.instructions.md`](instructions/) — aplikowane automatycznie do plików pasujących do ich glob `applyTo`.
3. **Prompt files** w [`.github/prompts/*.prompt.md`](prompts/) — wywoływane przez `/promptname` w Copilot Chat.
4. **Chat modes** w [`.github/chatmodes/*.chatmode.md`](chatmodes/) — wybierz z dropdownu chat-mode (Agent / Ask / Edit / twój custom).
5. **User prompt** — najwyższy precedens.

VS Code musi mieć te settings włączone (już w [`.vscode/settings.json`](../.vscode/settings.json)):

```jsonc
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.promptFiles": true,
}
```

## Workflows

Gdy zadanie pasuje do jednego z tych flowów, śledź go dokładnie:

- `new-feature` — pełny multi-agent (analyst → architect → dev + test równolegle → review + audit → docs)
- `bug-fix` — najpierw failing test, najmniejszy fix, regression test
- `refactor` — characterisation tests przypinają behaviour
- `new-library` — generator + ADR + docs
- `tech-debt` — scoped, measurable
- `incident-response` — speed > polish
- `documentation-audit` — skanuj code + docs, produkuj raport, regeneruj z raportu
- `spec-driven` — fazowy SDD (`/specify` → `/clarify` → `/plan` → `/tasks` → `/implement`), zaadaptowany z [github/spec-kit](https://github.com/github/spec-kit)

Pełny set żyje w [`.ai/workflows/`](../.ai/workflows/).

## External skills

Kuratorowane third-party skille z <https://skills.sh/>, które komplementują nasz stack, są skatalogowane w [`.ai/external-skills.md`](../.ai/external-skills.md). **Nic nie jest zainstalowane domyślnie**; instaluj per-developer przez `npx skillsadd <repo>`. Reguły projektu w `.ai/rules/` zawsze wygrywają gdy skill konfliktuje.

## Validation gate (przed raportowaniem Done)

```
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate      # sprawdza parytet .ai/, .claude/, .github/instructions, .github/prompts
```

Jeśli którykolwiek krok zawiedzie, **nie** jesteś done. Skieruj fail z powrotem do producing agent lub użytkownika.

## End-of-turn

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
