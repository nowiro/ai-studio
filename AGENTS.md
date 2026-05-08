# AGENTS.md — universal agent guide

> AI Studio uses the open AGENTS.md convention: any AI tool that reads `AGENTS.md` from a repo root gets an unambiguous picture of how to work here. **Claude Code** also reads [`CLAUDE.md`](CLAUDE.md) — the contents are equivalent; this file is the IDE-agnostic version.

## Where the truth lives

Everything an AI agent needs is in [`.ai/`](.ai/):

```
.ai/
├── README.md           ← start here
├── mcp.json            ← MCP server registry
├── external-skills.md  ← curated third-party skills (skills.sh) — not installed by default
├── rules/              ← non-negotiable rules (incl. principles.md — DRY/SOLID/KISS/YAGNI)
├── agents/             ← role definitions
├── workflows/          ← multi-agent recipes (incl. spec-driven.md adapted from github/spec-kit)
├── prompts/            ← reusable templates
└── context/            ← long-lived project context
```

## Per-tool wrappers (thin pointers — never duplicate `.ai/`)

| Tool             | Wrapper                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| **Claude Code**  | [`CLAUDE.md`](CLAUDE.md), [`.claude/`](.claude/) (subagents, slash commands, hooks)                  |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](.github/copilot-instructions.md), [`.github/instructions/`](.github/instructions/) (auto-applied by `applyTo` glob), [`.github/prompts/`](.github/prompts/) (`/promptname` in chat), [`.github/chatmodes/`](.github/chatmodes/) |
| **Anything else (Cursor, Cody, Aider, custom MCP client)** | this file + `.ai/` directly                                              |

`pnpm ai:validate` enforces parity across all of them. When you change a `.ai/` rule or agent, update the wrappers in the same PR.

## How agents collaborate

A single **Orchestrator** delegates to specialists:

| Role               | Reads                                 | Produces                       |
| ------------------ | ------------------------------------- | ------------------------------ |
| Orchestrator       | the user prompt + everything in `.ai/`| delegations + done verdict     |
| Analyst            | request + personas + glossary         | spec under `docs/analytical/specs/` |
| Architect          | spec + project graph + rules          | ADR + generator plan           |
| Frontend Developer | rules + ADR + lib API                 | TS / HTML / SCSS diff          |
| Backend Developer  | rules + ADR + API contracts           | server / Genkit diff           |
| Test Engineer      | dev hand-off + test rules             | Vitest / Playwright tests      |
| Test Scenario Author | analytical specs + scenarios JSON   | E2E skeletons under `apps/<app>-e2e/src/specs/` |
| Code Reviewer      | diff + all rules                      | `review:` verdict              |
| Security Auditor   | diff + security rules                 | `audit:` verdict               |
| Doc Writer         | diff + docs                           | docs diff + run-log entry      |
| Doc Auditor        | scanners' JSON + audit report         | `audit:` verdict, regenerated docs |
| Release Manager    | green main + ADRs                     | `nx release` outcome           |

See [`docs/ai-workflow/multi-agent-flow.md`](docs/ai-workflow/multi-agent-flow.md) for diagrams.

## What every agent MUST do

1. Load all of `.ai/rules/` at start.
2. Use MCP servers (`context7`, `nx`, `angular-cli`, `playwright`) instead of guessing.
3. Cite files as `path:line` — no invented paths.
4. End every turn with a `done:` or `blocked:` block.
5. Never bypass git hooks. Never invent code paths.
6. **Plan-first generation** — every multi-file or behaviour-changing task goes through a markdown plan owned by the orchestrator and executed via specialist delegation. Plans live at `docs/ai-workflow/plans/<date>-<slug>.md` (or `docs/analytical/specs/<slug>/plan.md` for SDD work). Specialists refuse delegations that don't cite a plan (`.ai/rules/core.md` §7).

## What every agent MUST NOT do

- ❌ Put secrets in tracked files.
- ❌ Use `*ngIf`/`[ngClass]`/`@HostBinding` (Angular 21 rules).
- ❌ Use `::ng-deep` or write a `tailwind.config.js` — Tailwind v4 is CSS-first; tokens live in `styles/tailwind.css`.
- ❌ Install `@analogjs/vitest-angular` — Angular 21 has native Vitest via `@angular/build:unit-test`.
- ❌ Mark a task done while any validator is red.
- ❌ Bundle a refactor with a feature or bug fix.
- ❌ Force-push to `main`.

## How to use this with…

| Tool                 | Read                                              |
| -------------------- | ------------------------------------------------- |
| Claude Code          | [`CLAUDE.md`](CLAUDE.md) + `.claude/`             |
| GitHub Copilot       | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) + `.github/{instructions,prompts,chatmodes}/` |
| Cursor               | this file + `.ai/` (point Cursor rules at `.ai/rules/`) |
| Aider, Cody, …       | this file + `.ai/`                                |
| Custom MCP client    | `.ai/mcp.json` is the registry                    |

## Validation

Run `pnpm ai:validate` to check that `.ai/` and `.claude/` are in sync (frontmatter, MCP entries, agent parity). CI runs this on every PR.

## Updating

- Treat `.ai/` and this file as production code: PR review, CODEOWNERS, conventional commits (`docs(ai): …`).
- Bump the `version:` in any frontmatter you change.
- Keep this file and `CLAUDE.md` aligned in spirit — same rules, different audiences.

## Upstream sources

- <https://angular.dev/ai> — Angular AI rules.
- <https://nx.dev/getting-started/intro> — Nx monorepo guide.
- <https://playwright.dev> — Playwright docs.
- <https://vitest.dev> — Vitest docs.
- <https://modelcontextprotocol.io> — MCP spec.
