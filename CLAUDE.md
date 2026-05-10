# CLAUDE.md — instructions for Claude Code in this repo

> Read this **first** in every session. Treat it as a thin pointer to the universal `.ai/` knowledge base.

## Identity

You are working inside **AI Studio** — an Angular Nx monorepo with a multi-agent AI workflow.

## First-time setup

```bash
pnpm install
pnpm bootstrap     # one-shot, idempotent — see README "Quickstart"
```

## Language preference

**Chat language: Polish.** Respond to the user in Polish unless they switch.
**Code, git, and tooling-readable surfaces: English.** See [`.ai/rules/language.md`](.ai/rules/language.md) for the full PL/EN split (docs PL · code EN · git EN · MCP tool descriptions EN).

## Always do this on session start

1. Read [`.ai/README.md`](.ai/README.md) and [`.ai/architecture.md`](.ai/architecture.md) (canonical nowiro AI architecture reference — trinity baseline).
2. Read every file in [`.ai/rules/`](.ai/rules/). They are non-negotiable. Especially [`core.md`](.ai/rules/core.md), [`principles.md`](.ai/rules/principles.md) (DRY, SOLID, KISS, YAGNI), [`production-readiness.md`](.ai/rules/production-readiness.md) (six must-haves before any agent feature ships), [`language.md`](.ai/rules/language.md) (PL/EN preference), and [`llm-optimization.md`](.ai/rules/llm-optimization.md) (token budgets and response shaping).
3. If your task is non-trivial (≥ 3 steps, or touches ≥ 2 files), spawn the **orchestrator** subagent and let it plan.
4. Use the MCP servers configured in `.claude/settings.json` and `.ai/mcp.json` (`context7`, `playwright`, `nx`, `angular-cli`, `memory`) before writing code that touches an external API.
5. If you touch any [trinity baseline file](docs/architecture/nowiro-projects-map.md#cross-cutting-invariants), run `pnpm trinity:check` (also enforced on pre-push).

## Cross-tool note

This repo supports **both Claude Code and GitHub Copilot** as first-class targets — different teams hold different licenses. The Copilot mirror lives under [`.github/copilot-instructions.md`](.github/copilot-instructions.md), [`.github/instructions/`](.github/instructions/), [`.github/prompts/`](.github/prompts/) and [`.github/chatmodes/`](.github/chatmodes/). When you change a `.ai/` rule or agent, update both wrappers — `pnpm ai:validate` checks parity.

## External skills

Curated third-party skills from <https://skills.sh/> that complement our stack are catalogued in [`.ai/external-skills.md`](.ai/external-skills.md). **Nothing is installed by default** — the catalog gives `npx skillsadd <repo>` commands to install per-developer. Project rules in `.ai/rules/` always win when a skill conflicts.

## Default subagent

When the user gives a non-trivial request, do not implement directly — call:

```
Agent({ subagent_type: "orchestrator", prompt: <user request + context> })
```

The Orchestrator delegates to specialists. Specialist agents are defined under [`.claude/agents/`](.claude/agents/) and [`.ai/agents/`](.ai/agents/).

## Hard rules (mirror of `.ai/rules/core.md`)

- ✅ Read code before claiming knowledge of it.
- ✅ Smallest reasonable change.
- ✅ Definition of Done = lint + typecheck + test + e2e + build all green, plus docs/ADR if behaviour changed.
- ✅ **Plan-first generation** — every code/doc/test/scenario generation goes through a markdown plan executed by multi-agent delegation (`.ai/rules/core.md` §7). Trivial single-file edits exempt.
- ❌ Never invent file paths, function names, package versions.
- ❌ Never bypass hooks (`--no-verify`).
- ❌ Never put secrets in tracked files.

## Plan-first generation (`core.md` §7)

For anything that touches ≥ 2 files OR changes behaviour, the **orchestrator** writes a plan markdown BEFORE delegating:

| Task type                                             | Plan file                                       |
| ----------------------------------------------------- | ----------------------------------------------- |
| Spec-driven (`/specify` flow)                         | `docs/analytical/specs/<slug>/plan.md`          |
| Everything else (bug, refactor, lib, docs, scenarios) | `docs/ai-workflow/plans/<YYYY-MM-DD>-<slug>.md` |

Use [`docs/ai-workflow/plans/_template.md`](docs/ai-workflow/plans/_template.md) for the orchestrator-owned form. Specialists (frontend-developer, backend-developer, test-engineer, test-scenario-author, doc-writer) refuse delegations whose `delegate:` block lacks `plan:` + `task_id:` fields.

## Angular conventions

Follow [`.ai/rules/angular.md`](.ai/rules/angular.md) — distilled from <https://angular.dev/ai>:

- Angular 21: standalone (implicit), OnPush, `inject()`, signal APIs.
- Native control flow (`@if`, `@for`, `@switch`, `@defer`).
- Reactive forms only.
- `data-testid` on interactive elements.
- Selector prefix `ais-` (components) / `ais` (directives).
- No `*ngIf`, no `[ngClass]`, no `@HostBinding`, no `console.*`.

## Styling (Material 3 + Tailwind v4)

Follow [`.ai/rules/styling.md`](.ai/rules/styling.md):

- **Angular Material 3** components (`mat-button`, `mat-form-field`, `mat-card`, …).
- **Tailwind v4 utilities** for layout / spacing / typography; colour utilities map to Material design tokens (`bg-primary`, `text-on-surface`, …).
- No `tailwind.config.js` — config lives in `styles/tailwind.scss` under `@theme`.
- No `::ng-deep`, no `[ngClass]`, no `[ngStyle]`.

## Nx conventions

Follow [`.ai/rules/nx.md`](.ai/rules/nx.md):

- `apps/*`, `libs/{feature,ui,data,util,shared}/*`.
- Tag every project; module-boundary lint enforces the layering.
- Use generators (via the `nx` and `angular-cli` MCP servers).
- Lib public API only via `src/index.ts`.

## Testing

Follow [`.ai/rules/testing.md`](.ai/rules/testing.md):

- **Vitest via Angular 21's native `@angular/build:unit-test --runner=vitest`** — no `@analogjs/vitest-angular` needed. Adopt Analog only if you want it as a meta-framework.
- Playwright for E2E (chromium/firefox/webkit + mobile).
- Page-object pattern for E2E. `getByRole` ▶ `getByTestId` ▶ CSS.

## Security

Follow [`.ai/rules/security.md`](.ai/rules/security.md):

- Never ship API keys to the client.
- Treat all model outputs as untrusted text.
- Tool calls that mutate state need human-in-the-loop confirmation.

## Workflows

Pick one of [`.ai/workflows/`](.ai/workflows/) when the task fits its trigger:

- `new-feature.md` — full multi-agent flow.
- `bug-fix.md` — failing test first, smallest fix, regression test.
- `refactor.md` — characterisation tests pin behaviour.
- `new-library.md` — generator + ADR + docs.
- `tech-debt.md` — scoped, measurable.
- `documentation-audit.md` — scan code+docs → report → regenerate from report.
- `spec-driven.md` — phased SDD flow (`/specify` → `/clarify` → `/plan` → `/tasks` → `/implement`), adapted from [github/spec-kit](https://github.com/github/spec-kit) onto our agents.
- `incident-response.md` — speed > polish.

## Slash commands

Defined under [`.claude/commands/`](.claude/commands/) (twins under [`.github/prompts/`](.github/prompts/) for Copilot):

| Command                                | What it does                                                    |
| -------------------------------------- | --------------------------------------------------------------- |
| `/new-feature <desc>`                  | full multi-agent new-feature flow                               |
| `/bug-fix <summary>`                   | failing test → smallest fix → regression test                   |
| `/new-library <name> <scope> <type>`   | scaffold a new Nx lib via the workflow                          |
| `/review-pr <pr or branch>`            | code-reviewer + (when relevant) security-auditor                |
| `/release [notes]`                     | `nx release` end-to-end                                         |
| `/sync-docs`                           | doc-writer pass against last release                            |
| `/migrate-doc <src> <tgt> <type>`      | move one legacy doc to canonical template                       |
| `/audit-docs`                          | run scanners → doc-auditor → open issues                        |
| `/regenerate-docs`                     | rewrite docs from latest audit report                           |
| `/generate-test-scenarios [spec-slug]` | extract Given/When/Then → Playwright skeletons                  |
| `/run-test-scenarios [grep]`           | run E2E; switch to Playwright MCP for live debugging on failure |
| `/specify <desc>`                      | SDD phase 1 — analyst writes `spec.md` (no tech)                |
| `/clarify [slug]`                      | SDD phase 1.5 — resolve `[?]` markers in `spec.md`              |
| `/plan [slug]`                         | SDD phase 2 — architect writes `plan.md` + (if needed) ADR      |
| `/tasks [slug]`                        | SDD phase 3 — orchestrator decomposes plan into `tasks.md` DAG  |
| `/implement [slug] [task\|all]`        | SDD phase 4 — orchestrator executes tasks + DoD gate            |

## Validation gate (before reporting Done)

```
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
```

If any step fails, you are **not** done. Route the failure back to the producing agent or the user.

## End-of-turn

Always emit one of:

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
