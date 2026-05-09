# AI Studio

> Angular 21 + Material 3 + Tailwind v4 Nx monorepo starter with a multi-agent AI workflow built around the rules at [angular.dev/ai](https://angular.dev/ai).

[![CI](https://img.shields.io/badge/ci-green-brightgreen)](.github/workflows/ci.yml)
[![Angular](https://img.shields.io/badge/Angular-21-dd0031)](https://angular.dev)
[![Material 3](https://img.shields.io/badge/Material-3-6750a4)](https://material.angular.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com)
[![Nx](https://img.shields.io/badge/Nx-21-143055)](https://nx.dev)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0-yellow)](https://www.conventionalcommits.org)

## What this is

A starter you clone when you want:

1. An **Angular 21** Nx monorepo with strict library taxonomy and module-boundary lint.
2. **Angular Material 3** for components and **Tailwind CSS v4** for utilities — design tokens shared via CSS variables.
3. A **multi-agent AI workflow** (Orchestrator + 11 specialists) **driven by Claude Code _and_ GitHub Copilot equally** — `.ai/` is the universal source of truth, `.claude/` and `.github/{instructions,prompts,chatmodes}/` are thin wrappers.
4. **Golden engineering rules** (DRY, SOLID, KISS, YAGNI) in [`.ai/rules/principles.md`](.ai/rules/principles.md) — agents and reviewers cite them by id.
5. **Doc tooling**: scanners + auditor agent + slash command to migrate legacy docs to canonical templates and regenerate docs from compliance reports.
6. **Test scenario tooling**: extracts Given/When/Then from analytical specs into Playwright skeletons, then runs them via the Playwright MCP for live debugging.
7. **Vitest** (native via `@angular/build:unit-test`) + **Playwright** with a working pyramid. No Analog dependency.
8. **ESLint flat config** + Prettier + Husky + lint-staged + commitlint + Commitizen.
9. **MCP servers** preconfigured: `context7`, `playwright`, `nx`, `angular-cli`.
10. **GitHub** templates for issues (bug, feature, AI task, ADR, incident, tech-debt, docs) and PRs.
11. Documentation in three layers: **technical**, **analytical**, **programming** — plus the AI workflow + monthly auto-audit (`docs-audit.yml`).

## Quickstart — one command after clone

```bash
git clone https://github.com/nowiro/ai-studio.git
cd ai-studio
pnpm install                          # install deps so the bootstrap script can run
pnpm bootstrap                        # → idempotent, cross-platform setup
```

`pnpm bootstrap` (= `node tools/scripts/bootstrap.mjs`) runs cross-platform on **Windows / macOS / Linux** and does:

1. Verifies Node version against `.nvmrc` and that `pnpm` is on `PATH`.
2. Installs dependencies (skipped if `node_modules` already exists; `--reinstall` to force).
3. Runs `pnpm prepare` to install husky git hooks.
4. Runs the **trinity baseline check** — warns on drift across `ai-mcp-alm` / `ai-mcp-devtools`.
5. Seeds a user-profile config (only when `config.example.json` exists — `ai-studio` does not need one today; the sibling MCP repos do).

Flags: `--reinstall` · `--skip-install` · `--skip-trinity` · `--skip-config`. Re-running is safe.

## Working in the repo

```bash
# Validate the AI configuration
pnpm ai:validate

# Generate your first app (Tailwind wired in by the generator)
pnpm exec nx g @nx/angular:app studio --add-tailwind --style=scss

# Add Angular Material 3 (theme + CDK + animations)
pnpm exec nx g @angular/material:ng-add --project=studio --theme=custom --typography --animations=enabled

# Generate a feature lib
pnpm exec nx g @nx/angular:lib feature/welcome --tags=scope:feature,type:feature

# Run it
pnpm exec nx serve studio
```

After step 4 the app's `src/styles.scss` should contain `@use '@angular/material' as mat;` + `mat.theme(...)`. List `styles/tailwind.scss` as the first entry in `project.json` `styles` array (do **not** `@import` it from `styles.scss`). See [`.ai/rules/styling.md`](.ai/rules/styling.md) for the full pattern.

## Repository layout

```
ai-studio/
├── apps/                     # deployable Angular apps
├── libs/                     # feature / ui / data / util / shared libs
├── .ai/                      # universal AI knowledge base
│   ├── rules/                #   non-negotiable rules (incl. principles.md)
│   ├── agents/               #   role definitions (11)
│   ├── workflows/            #   multi-agent recipes (7)
│   ├── prompts/              #   reusable templates
│   ├── context/              #   long-lived context
│   └── mcp.json              #   MCP server registry
├── .claude/                  # Claude Code wrappers (subagents, slash commands, hooks)
├── .github/                  # issue / PR templates, CI workflows, dependabot
│   ├── copilot-instructions.md  # Copilot main entrypoint
│   ├── instructions/         #   scoped instructions (applyTo glob)
│   ├── prompts/              #   /promptname for Copilot Chat
│   └── chatmodes/            #   custom chat modes (Orchestrator, Doc Auditor)
├── .husky/                   # git hooks
├── .vscode/                  # extensions, settings, MCP
├── docs/
│   ├── technical/            # architecture, system design, runbook
│   ├── analytical/           # business reqs, personas, specs
│   ├── programming/          # coding standards, testing, git workflow
│   ├── ai-workflow/          # multi-agent flow, prompts, runs
│   ├── architecture/         # system, dependencies, tech-debt
│   └── adr/                  # ADRs (MADR 4.0)
├── tools/scripts/            # build-ai-context, validate-ai-config, hooks
├── CLAUDE.md                 # Claude Code entry point
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

Read [`docs/ai-workflow/multi-agent-flow.md`](docs/ai-workflow/multi-agent-flow.md) for the full picture, [`CLAUDE.md`](CLAUDE.md) for Claude Code specifics, and [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for GitHub Copilot specifics.

## Tech stack

| Layer            | Choice                                                            |
| ---------------- | ----------------------------------------------------------------- |
| Monorepo         | **Nx 21+**                                                        |
| Framework        | **Angular 21** (standalone, signals, native SSR)                  |
| Components       | **Angular Material 3** (`@angular/material` + `@angular/cdk`)     |
| Utility CSS      | **Tailwind CSS v4** (CSS-first, `@tailwindcss/postcss`)           |
| Unit / Component | **Vitest** via native `@angular/build:unit-test`                  |
| E2E              | **Playwright** (chromium, firefox, webkit, mobile)                |
| Linting          | **ESLint 9** flat + `angular-eslint` + `tailwindcss`              |
| Formatting       | **Prettier 3** + sort-imports + organize-attributes + tailwindcss |
| Hooks            | **Husky 9** + `lint-staged`                                       |
| Commits          | **Commitizen** + **Commitlint** (Conventional)                    |
| Package manager  | **pnpm 9**                                                        |
| Node             | **20.19+ LTS**                                                    |
| MCP servers      | context7, playwright, nx, angular-cli                             |

See [`docs/technical/tech-stack.md`](docs/technical/tech-stack.md) for the rationale.

## Daily commands

```bash
pnpm install                # install deps
pnpm graph                  # open the project graph in browser
pnpm affected:test          # tests for what changed
pnpm affected:lint          # lint  for what changed
pnpm affected:e2e           # E2E   for what changed
pnpm affected:build         # build for what changed
pnpm test:cov               # all tests with coverage
pnpm format                 # prettier --write everywhere
pnpm commit                 # guided conventional commit
pnpm release                # nx release (dry-run via CI dispatch by default)
pnpm ai:validate            # validate .ai/, .claude/ and .github/{instructions,prompts,chatmodes} parity
pnpm ai:context             # build a single-file digest of .ai/

# Documentation tooling
pnpm docs:scan              # inventory every md file → tmp/docs-scan.json
pnpm docs:api               # extract every public export → tmp/public-api.json
pnpm docs:audit             # combine into a markdown report → tmp/doc-audit-<date>.md

# Test scenario tooling
pnpm test:scenarios         # extract Given/When/Then → tmp/scenarios/<spec>.{json,spec.ts}
```

## AI tooling cheatsheet

Both Claude Code (slash commands) and GitHub Copilot Chat (`/promptname`) expose the same workflows:

| Workflow                                    | Claude command                    | Copilot prompt                |
| ------------------------------------------- | --------------------------------- | ----------------------------- |
| Full multi-agent feature                    | `/new-feature <desc>`             | `/new-feature`                |
| Bug fix (failing test first)                | `/bug-fix <summary>`              | `/bug-fix`                    |
| New library scaffolding                     | `/new-library <name> <s> <t>`     | _(orchestrator chat mode)_    |
| PR review                                   | `/review-pr <pr or branch>`       | `/review-pr`                  |
| Migrate legacy doc to canonical template    | `/migrate-doc <src> <tgt> <type>` | `/migrate-doc`                |
| Audit docs vs current code                  | `/audit-docs`                     | `/audit-docs`                 |
| Regenerate docs from latest audit report    | `/regenerate-docs`                | `/regenerate-docs`            |
| Generate Playwright skeletons from specs    | `/generate-test-scenarios [slug]` | `/generate-test-scenarios`    |
| Run E2E + debug failures via Playwright MCP | `/run-test-scenarios [grep]`      | `/run-test-scenarios`         |
| Cut a release                               | `/release [notes]`                | _(release-manager chat mode)_ |

## Documentation entry points

| Audience             | Start here                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| New contributor      | [`CONTRIBUTING.md`](CONTRIBUTING.md)                                                                                           |
| Claude Code agent    | [`CLAUDE.md`](CLAUDE.md) + [`.claude/`](.claude/)                                                                              |
| GitHub Copilot agent | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) + [`.github/{instructions,prompts,chatmodes}/`](.github/) |
| Architect / reviewer | [`docs/architecture/system.md`](docs/architecture/system.md) + [`docs/adr/`](docs/adr/)                                        |
| Product / Analyst    | [`docs/analytical/`](docs/analytical/)                                                                                         |
| QA / Test Engineer   | [`docs/programming/testing-strategy.md`](docs/programming/testing-strategy.md)                                                 |

## License

MIT — see [LICENSE](LICENSE).
