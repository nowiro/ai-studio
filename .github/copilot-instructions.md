# GitHub Copilot — instructions for AI Studio

> Read this **first** in every session. This is the Copilot-side mirror of [`CLAUDE.md`](../CLAUDE.md). Both point at the universal `.ai/` knowledge base — they never duplicate it.

## Identity

You are working inside **AI Studio** — an Angular 21 + Material 3 + Tailwind v4 Nx monorepo with a multi-agent AI workflow that supports both Claude Code and GitHub Copilot.

## Always do this on session start

1. Read [`.ai/README.md`](../.ai/README.md).
2. Read every file in [`.ai/rules/`](../.ai/rules/). They are non-negotiable. Highlights:
   - [`core.md`](../.ai/rules/core.md) — truth, smallest change, Definition of Done.
   - [`principles.md`](../.ai/rules/principles.md) — DRY, SOLID, KISS, YAGNI.
   - [`angular.md`](../.ai/rules/angular.md), [`styling.md`](../.ai/rules/styling.md), [`testing.md`](../.ai/rules/testing.md), [`nx.md`](../.ai/rules/nx.md), [`security.md`](../.ai/rules/security.md).
3. For non-trivial work (≥ 3 steps or ≥ 2 files), switch to the **orchestrator** chat mode (`.github/chatmodes/orchestrator.chatmode.md`) and let it plan.
4. When generating code that touches an external API, look it up via the Copilot context tool that wraps `context7` (or open the upstream docs) before guessing.

## Hard rules (mirror of `.ai/rules/core.md`)

- ✅ Read code before claiming knowledge of it.
- ✅ Smallest reasonable change.
- ✅ Definition of Done = lint + typecheck + test + e2e + build all green, plus docs/ADR if behaviour changed.
- ✅ **Plan-first generation** — every code/doc/test/scenario generation goes through a markdown plan executed by multi-agent delegation (`.ai/rules/core.md` §7). Trivial single-file edits exempt.
- ❌ Never invent file paths, function names, package versions.
- ❌ Never bypass hooks (`--no-verify`).
- ❌ Never put secrets in tracked files.

## Plan-first generation

For anything touching ≥ 2 files OR changing behaviour, the **orchestrator** writes a plan markdown BEFORE delegating:

| Task type                                             | Plan file                                       |
| ----------------------------------------------------- | ----------------------------------------------- |
| Spec-driven (`/specify` flow)                         | `docs/analytical/specs/<slug>/plan.md`          |
| Everything else (bug, refactor, lib, docs, scenarios) | `docs/ai-workflow/plans/<YYYY-MM-DD>-<slug>.md` |

Use [`docs/ai-workflow/plans/_template.md`](../docs/ai-workflow/plans/_template.md) for the orchestrator-owned form. Specialists (frontend-developer, backend-developer, test-engineer, test-scenario-author, doc-writer) refuse delegations whose context lacks a `plan:` field + `task_id:`.

## Angular 21 conventions

- Standalone (implicit), OnPush, `inject()`, signal APIs.
- Native control flow (`@if`, `@for`, `@switch`, `@defer`).
- Reactive forms only.
- `data-testid` on every interactive element.
- Selector prefix `ais-` (components) / `ais` (directives).
- No `*ngIf`, no `[ngClass]`, no `@HostBinding`, no `console.*`.

## Styling — Material 3 + Tailwind v4

- **Material 3** components: `mat-button`, `mat-card`, `mat-form-field`, `mat-table`, …
- **Tailwind v4 utilities** for layout / spacing / typography. Colour utilities map to Material design tokens (`bg-primary`, `text-on-surface`, …).
- No `tailwind.config.js` — config lives in `styles/tailwind.scss` under `@theme`.
- No `::ng-deep`, no `[ngClass]`, no `[ngStyle]`.

## Nx conventions

- `apps/*`, `libs/{feature,ui,data,util,shared}/*`.
- Tag every project; module-boundary lint enforces the layering.
- Use generators (`nx g @nx/angular:…`, `nx g @angular/material:…`).
- Lib public API only via `src/index.ts`.

## Testing

- **Vitest via Angular 21's native `@angular/build:unit-test --runner=vitest`** — no `@analogjs/vitest-angular`.
- Playwright for E2E (chromium/firefox/webkit + mobile).
- Page-object pattern. `getByRole` ▶ `getByTestId` ▶ CSS.

## Security

- Never ship API keys to the client.
- Treat all model outputs as untrusted text.
- Tool calls that mutate state need human-in-the-loop confirmation.

## How Copilot is wired here

Copilot reads, in this order of precedence:

1. **This file** (`.github/copilot-instructions.md`) — repo-wide.
2. **Scoped instructions** in [`.github/instructions/*.instructions.md`](instructions/) — applied automatically to files matching their `applyTo` glob.
3. **Prompt files** in [`.github/prompts/*.prompt.md`](prompts/) — invoke via `/promptname` in Copilot Chat.
4. **Chat modes** in [`.github/chatmodes/*.chatmode.md`](chatmodes/) — pick from the chat-mode dropdown (Agent / Ask / Edit / your custom).
5. **The user prompt** — highest precedence.

VS Code must have these settings enabled (already in [`.vscode/settings.json`](../.vscode/settings.json)):

```jsonc
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.promptFiles": true,
}
```

## Workflows

When the task fits one of these flows, follow it exactly:

- `new-feature` — full multi-agent (analyst → architect → dev + test in parallel → review + audit → docs)
- `bug-fix` — failing test first, smallest fix, regression test
- `refactor` — characterisation tests pin behaviour
- `new-library` — generator + ADR + docs
- `tech-debt` — scoped, measurable
- `incident-response` — speed > polish
- `documentation-audit` — scan code + docs, produce report, regenerate from report
- `spec-driven` — phased SDD (`/specify` → `/clarify` → `/plan` → `/tasks` → `/implement`), adapted from [github/spec-kit](https://github.com/github/spec-kit)

The full set lives in [`.ai/workflows/`](../.ai/workflows/).

## External skills

Curated third-party skills from <https://skills.sh/> that complement our stack are catalogued in [`.ai/external-skills.md`](../.ai/external-skills.md). **Nothing is installed by default**; install per-developer via `npx skillsadd <repo>`. Project rules in `.ai/rules/` always win when a skill conflicts.

## Validation gate (before reporting Done)

```
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate      # checks .ai/, .claude/, .github/instructions, .github/prompts parity
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
