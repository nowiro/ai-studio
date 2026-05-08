# CLAUDE.md — instructions for Claude Code in this repo

> Read this **first** in every session. Treat it as a thin pointer to the universal `.ai/` knowledge base.

## Identity

You are working inside **AI Studio** — an Angular Nx monorepo with a multi-agent AI workflow.

## Always do this on session start

1. Read [`.ai/README.md`](.ai/README.md).
2. Read every file in [`.ai/rules/`](.ai/rules/). They are non-negotiable. Especially [`core.md`](.ai/rules/core.md) and [`principles.md`](.ai/rules/principles.md) (golden rules — DRY, SOLID, KISS, YAGNI).
3. If your task is non-trivial (≥ 3 steps, or touches ≥ 2 files), spawn the **orchestrator** subagent and let it plan.
4. Use the MCP servers configured in `.claude/settings.json` and `.ai/mcp.json` (`context7`, `playwright`, `nx`, `angular-cli`) before writing code that touches an external API.

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

| Task type                                             | Plan file                                                |
| ----------------------------------------------------- | -------------------------------------------------------- |
| Spec-driven (`/specify` flow)                         | `docs/analytical/specs/<slug>/plan.md`                   |
| Everything else (bug, refactor, lib, docs, scenarios) | `docs/ai-workflow/plans/<YYYY-MM-DD>-<slug>.md`          |

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
- No `tailwind.config.js` — config lives in `styles/tailwind.css` under `@theme`.
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

| Command                        | What it does                                                          |
| ------------------------------ | --------------------------------------------------------------------- |
| `/new-feature <desc>`          | full multi-agent new-feature flow                                     |
| `/bug-fix <summary>`           | failing test → smallest fix → regression test                         |
| `/new-library <name> <scope> <type>` | scaffold a new Nx lib via the workflow                          |
| `/review-pr <pr or branch>`    | code-reviewer + (when relevant) security-auditor                      |
| `/release [notes]`             | `nx release` end-to-end                                               |
| `/sync-docs`                   | doc-writer pass against last release                                  |
| `/migrate-doc <src> <tgt> <type>` | move one legacy doc to canonical template                          |
| `/audit-docs`                  | run scanners → doc-auditor → open issues                              |
| `/regenerate-docs`             | rewrite docs from latest audit report                                 |
| `/generate-test-scenarios [spec-slug]` | extract Given/When/Then → Playwright skeletons               |
| `/run-test-scenarios [grep]`   | run E2E; switch to Playwright MCP for live debugging on failure       |
| `/specify <desc>`              | SDD phase 1 — analyst writes `spec.md` (no tech)                      |
| `/clarify [slug]`              | SDD phase 1.5 — resolve `[?]` markers in `spec.md`                    |
| `/plan [slug]`                 | SDD phase 2 — architect writes `plan.md` + (if needed) ADR            |
| `/tasks [slug]`                | SDD phase 3 — orchestrator decomposes plan into `tasks.md` DAG         |
| `/implement [slug] [task\|all]` | SDD phase 4 — orchestrator executes tasks + DoD gate                  |

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
