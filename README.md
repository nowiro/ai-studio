# AI Studio

> Starter Angular 21 + Material 3 + Tailwind v4 Nx monorepo z multi-agentowym workflow AI zbudowanym wokół reguł z [angular.dev/ai](https://angular.dev/ai).

[![CI](https://img.shields.io/badge/ci-green-brightgreen)](.github/workflows/ci.yml)
[![Angular](https://img.shields.io/badge/Angular-21-dd0031)](https://angular.dev)
[![Material 3](https://img.shields.io/badge/Material-3-6750a4)](https://material.angular.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com)
[![Nx](https://img.shields.io/badge/Nx-21-143055)](https://nx.dev)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0-yellow)](https://www.conventionalcommits.org)

## Co to jest

Starter który klonujesz gdy chcesz:

1. Monorepo Nx **Angular 21** ze ścisłą taksonomią library i module-boundary lint.
2. **Angular Material 3** dla komponentów i **Tailwind CSS v4** dla utility — design tokens współdzielone via CSS variables.
3. **Multi-agentowy workflow AI** (Orchestrator + 11 specjalistów) **napędzany przez Claude Code _i_ GitHub Copilot równo** — `.ai/` jest uniwersalnym źródłem prawdy, `.claude/` i `.github/{instructions,prompts,chatmodes}/` są cienkimi wrapperami.
4. **Złote reguły inżynierskie** (DRY, SOLID, KISS, YAGNI) w [`.ai/rules/principles.md`](.ai/rules/principles.md) — agenci i reviewerzy cytują je po id.
5. **Doc tooling**: skanery + auditor agent + slash komenda do migracji legacy docs do kanonicznych templatów i regeneracji docs z raportów compliance.
6. **Test scenario tooling**: wyciąga Given/When/Then z analytical specs do szkieletów Playwright, potem uruchamia je via Playwright MCP do live debugu.
7. **Vitest** (natywny via `@angular/build:unit-test`) + **Playwright** z działającą piramidą. Bez zależności Analog.
8. **ESLint flat config** + Prettier + Husky + lint-staged + commitlint + Commitizen.
9. **Serwery MCP** preconfigured: `context7`, `playwright`, `nx`, `angular-cli`.
10. Templatki **GitHub** dla issues (bug, feature, AI task, ADR, incident, tech-debt, docs) i PR-ów.
11. Dokumentacja w trzech warstwach: **technical**, **analytical**, **programming** — plus AI workflow + miesięczny auto-audyt (`docs-audit.yml`).

## Quickstart — jedna komenda po clone

```bash
git clone https://github.com/nowiro/ai-studio.git
cd ai-studio
pnpm install                          # zainstaluj deps żeby bootstrap mógł uruchomić
pnpm bootstrap                        # → idempotent, cross-platform setup
```

`pnpm bootstrap` (= `node tools/scripts/bootstrap.mjs`) działa cross-platform na **Windows / macOS / Linux** i:

1. Weryfikuje wersję Node względem `.nvmrc` i obecność `pnpm` na `PATH`.
2. Instaluje zależności (pomijane jeśli `node_modules` już istnieje; `--reinstall` wymusza).
3. Uruchamia `pnpm prepare` żeby zainstalować hooki husky git.
4. Uruchamia **trinity baseline check** — ostrzega o drift między `ai-mcp-alm` / `ai-mcp-devtools`.
5. Zasiewa user-profile config (tylko gdy `config.example.json` istnieje — `ai-studio` nie potrzebuje dziś; siostrzane repo MCP potrzebują).

Flagi: `--reinstall` · `--skip-install` · `--skip-trinity` · `--skip-config`. Ponowne uruchomienie jest bezpieczne.

## Praca w repo

```bash
# Walidacja konfiguracji AI
pnpm ai:validate

# Wygeneruj pierwszą aplikację (Tailwind wired in przez generator)
pnpm exec nx g @nx/angular:app studio --add-tailwind --style=scss

# Dodaj Angular Material 3 (theme + CDK + animations)
pnpm exec nx g @angular/material:ng-add --project=studio --theme=custom --typography --animations=enabled

# Wygeneruj feature liba
pnpm exec nx g @nx/angular:lib feature/welcome --tags=scope:feature,type:feature

# Uruchom
pnpm exec nx serve studio
```

Po kroku 4 `src/styles.scss` aplikacji powinien zawierać `@use '@angular/material' as mat;` + `mat.theme(...)`. Wymień `styles/tailwind.scss` jako pierwszy wpis w arrayu `styles` w `project.json` (**nie** `@import` go z `styles.scss`). Pełen pattern: [`.ai/rules/styling.md`](.ai/rules/styling.md).

## Layout repozytorium

```
ai-studio/
├── apps/                     # deployowalne aplikacje Angular
├── libs/                     # feature / ui / data / util / shared liby
├── .ai/                      # uniwersalna baza wiedzy AI
│   ├── rules/                #   reguły nienegocjowalne (incl. principles.md)
│   ├── agents/               #   definicje ról (11)
│   ├── workflows/            #   multi-agent recipes (7)
│   ├── prompts/              #   reużywalne templatki
│   ├── context/              #   long-lived context
│   └── mcp.json              #   rejestr serwerów MCP
├── .claude/                  # wrappery Claude Code (subagents, slash commands, hooks)
├── .github/                  # templatki issue / PR, workflows CI, dependabot
│   ├── copilot-instructions.md  # główny entrypoint Copilot
│   ├── instructions/         #   scoped instructions (applyTo glob)
│   ├── prompts/              #   /promptname dla Copilot Chat
│   └── chatmodes/            #   custom chat modes (Orchestrator, Doc Auditor)
├── .husky/                   # hooki git
├── .vscode/                  # extensions, settings, MCP
├── docs/
│   ├── technical/            # architektura, system design, runbook
│   ├── analytical/           # wymagania biznesowe, persony, specs
│   ├── programming/          # standardy kodowania, testowanie, git workflow
│   ├── ai-workflow/          # multi-agent flow, prompts, runs
│   ├── architecture/         # system, zależności, tech-debt
│   └── adr/                  # ADR-y (MADR 4.0)
├── tools/scripts/            # build-ai-context, validate-ai-config, hooks
├── CLAUDE.md                 # entry point Claude Code
├── CONTRIBUTING.md
├── SECURITY.md
└── package.json / nx.json / tsconfig.base.json / eslint.config.mjs / …
```

## Multi-agent workflow

```
                 ┌──────────────┐
   user ─────►   │ Orchestrator │  ──► nx graph + .ai rules
                 └──────┬───────┘
                        ▼
        ┌────────────┬──┴───┬──────────────┐
        ▼            ▼      ▼              ▼
     Analyst    Architect Dev(s)     Test Engineer
        │            │      │              │
        └─────────► aggregates ◄────────────┘
                        ▼
              Reviewer + Security Auditor
                        ▼
                    Doc Writer
                        ▼
                  Release Manager
```

Pełny obraz: [`docs/ai-workflow/multi-agent-flow.md`](docs/ai-workflow/multi-agent-flow.md). Specyfika Claude Code: [`CLAUDE.md`](CLAUDE.md). Specyfika GitHub Copilot: [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

## Tech stack

| Warstwa          | Wybór                                                             |
| ---------------- | ----------------------------------------------------------------- |
| Monorepo         | **Nx 21+**                                                        |
| Framework        | **Angular 21** (standalone, signals, native SSR)                  |
| Komponenty       | **Angular Material 3** (`@angular/material` + `@angular/cdk`)     |
| Utility CSS      | **Tailwind CSS v4** (CSS-first, `@tailwindcss/postcss`)           |
| Unit / Component | **Vitest** via natywne `@angular/build:unit-test`                 |
| E2E              | **Playwright** (chromium, firefox, webkit, mobile)                |
| Linting          | **ESLint 9** flat + `angular-eslint` + `tailwindcss`              |
| Formatting       | **Prettier 3** + sort-imports + organize-attributes + tailwindcss |
| Hooks            | **Husky 9** + `lint-staged`                                       |
| Commity          | **Commitizen** + **Commitlint** (Conventional)                    |
| Package manager  | **pnpm 9**                                                        |
| Node             | **20.19+ LTS**                                                    |
| Serwery MCP      | context7, playwright, nx, angular-cli                             |

Uzasadnienie: [`docs/technical/tech-stack.md`](docs/technical/tech-stack.md).

## Komendy codzienne

```bash
pnpm install                # install deps
pnpm graph                  # otwórz project graph w przeglądarce
pnpm affected:test          # testy dla tego co się zmieniło
pnpm affected:lint          # lint  dla tego co się zmieniło
pnpm affected:e2e           # E2E   dla tego co się zmieniło
pnpm affected:build         # build dla tego co się zmieniło
pnpm test:cov               # wszystkie testy z coverage
pnpm format                 # prettier --write wszędzie
pnpm commit                 # guided conventional commit
pnpm release                # nx release (dry-run via CI dispatch domyślnie)
pnpm ai:validate            # walidacja parytetu .ai/, .claude/ i .github/{instructions,prompts,chatmodes}
pnpm ai:context             # zbuduj single-file digest .ai/

# Documentation tooling
pnpm docs:scan              # inwentaryzuj każdy plik md → tmp/docs-scan.json
pnpm docs:api               # wyciągnij każdy public export → tmp/public-api.json
pnpm docs:audit             # połącz w markdown raport → tmp/doc-audit-<date>.md

# Test scenario tooling
pnpm test:scenarios         # wyciągnij Given/When/Then → tmp/scenarios/<spec>.{json,spec.ts}
```

## AI tooling cheatsheet

Zarówno Claude Code (slash commands) jak i GitHub Copilot Chat (`/promptname`) wystawiają te same workflows:

| Workflow                                        | Komenda Claude                    | Prompt Copilot                |
| ----------------------------------------------- | --------------------------------- | ----------------------------- |
| Pełna multi-agent feature                       | `/new-feature <desc>`             | `/new-feature`                |
| Bug fix (najpierw failing test)                 | `/bug-fix <summary>`              | `/bug-fix`                    |
| Scaffolding nowego liba                         | `/new-library <name> <s> <t>`     | _(orchestrator chat mode)_    |
| Review PR                                       | `/review-pr <pr or branch>`       | `/review-pr`                  |
| Migracja legacy doc do kanonicznego template    | `/migrate-doc <src> <tgt> <type>` | `/migrate-doc`                |
| Audyt docs vs aktualny kod                      | `/audit-docs`                     | `/audit-docs`                 |
| Regeneracja docs z najnowszego raportu audytu   | `/regenerate-docs`                | `/regenerate-docs`            |
| Generuj szkielety Playwright z specs            | `/generate-test-scenarios [slug]` | `/generate-test-scenarios`    |
| Uruchom E2E + debug failures via Playwright MCP | `/run-test-scenarios [grep]`      | `/run-test-scenarios`         |
| Wydanie                                         | `/release [notes]`                | _(release-manager chat mode)_ |

## Entry points dokumentacji

| Audience             | Zacznij tutaj                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Nowy kontrybutor     | [`CONTRIBUTING.md`](CONTRIBUTING.md)                                                                                           |
| Agent Claude Code    | [`CLAUDE.md`](CLAUDE.md) + [`.claude/`](.claude/)                                                                              |
| Agent GitHub Copilot | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) + [`.github/{instructions,prompts,chatmodes}/`](.github/) |
| Architekt / reviewer | [`docs/architecture/system.md`](docs/architecture/system.md) + [`docs/adr/`](docs/adr/)                                        |
| Product / Analityk   | [`docs/analytical/`](docs/analytical/)                                                                                         |
| QA / Test Engineer   | [`docs/programming/testing-strategy.md`](docs/programming/testing-strategy.md)                                                 |

## Licencja

MIT — patrz [LICENSE](LICENSE).
