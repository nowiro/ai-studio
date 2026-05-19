---
id: external.skills
title: External AI skills catalog
type: reference
version: 1.0.0
---

# External AI skills catalog

> Curated skills from <https://skills.sh/> that complement AI Studio's stack.
> **Nothing here is installed.** Install on demand per developer/agent — they live outside the repo.
> Source of truth for our own conventions remains `.ai/rules/` — external skills _augment_, never override.

## How to install (per developer)

Skills are installed via the `skillsadd` CLI into the local agent's skills directory:

```bash
npx skillsadd <owner/repo>
```

Supported agents: Claude Code, GitHub Copilot, Cursor, VS Code, Cline, Windsurf.

After install, the agent loads the skill metadata at session start. To remove, delete the skill file from the local skills dir.

## When to reach for an external skill vs use our agents

| Need                                            | Use this                                   |
| ----------------------------------------------- | ------------------------------------------ |
| Codify project-specific rules (Angular 21, Nx)  | `.ai/rules/*.md` — already defined         |
| Multi-step workflow with handoffs               | `.ai/agents/orchestrator.md` + specialists |
| Cross-cutting expertise (TDD method, debugging) | External skill (this file)                 |
| One-off transform on a snippet                  | Direct prompt — no skill needed            |

A skill is a _frozen prompt_ that ships expertise. Our agents are _roles_ that delegate.

## Curated skills

### Architecture & planning

- **Improve Codebase Architecture** — `mattpocock/skills/improve-codebase-architecture`
  - Refactoring + structural optimisation framework. Pairs with our `architect` agent for ADR work.
  - Install: `npx skillsadd mattpocock/skills`

- **Writing Plans** — `obra/superpowers/writing-plans`
  - Technical-plan authoring discipline (assumptions, risks, rollback). Useful before `/plan` when the change is large.
  - Install: `npx skillsadd obra/superpowers`

### Testing & quality

- **Test-Driven Development** — `obra/superpowers/test-driven-development`
  - Red-green-refactor methodology. Reinforces our [`testing.md`](rules/testing.md) pyramid and the `test-engineer` agent.
  - Install: `npx skillsadd obra/superpowers`

- **Playwright Best Practices** — `currents-dev/playwright-best-practices-skill/playwright-best-practices`
  - Locator strategy, parallelism, traces. Pairs with our `test-scenario-author` agent and the `playwright` MCP server.
  - Install: `npx skillsadd currents-dev/playwright-best-practices-skill`

### Frontend & styling

- **Tailwind Design System** — `wshobson/agents/tailwind-design-system`
  - Utility-first patterns at scale. Complements [`styling.md`](rules/styling.md) and our Tailwind v4 + Material 3 token bridge.
  - Install: `npx skillsadd wshobson/agents`

- **Frontend Design Guidelines** — `anthropics/skills/frontend-design`
  - General design principles (hierarchy, contrast, spacing). Useful for the `frontend-developer` agent on greenfield UI.
  - Install: `npx skillsadd anthropics/skills`

### TypeScript

- **TypeScript Advanced Types** — `wshobson/agents/typescript-advanced-types`
  - Conditional, mapped, template-literal types. For the moments when our public-API typing gets hairy.
  - Install: `npx skillsadd wshobson/agents`

### Workflow & debugging

- **Systematic Debugging** — `obra/superpowers/systematic-debugging`
  - Hypothesis-driven debugging method. Pairs with the `bug-fix` workflow.
  - Install: `npx skillsadd obra/superpowers`

- **Git Worktrees** — `obra/superpowers/using-git-worktrees`
  - Worktree-per-feature flow — useful in Nx monorepos when running parallel agent sessions.
  - Install: `npx skillsadd obra/superpowers`

## Adding a skill to the catalog

1. Try the skill on a real task; do not list speculatively.
2. Add an entry above with: name, repo path, one-line value-prop, install command.
3. If it conflicts with one of our `.ai/rules/`, **don't add it** — open an ADR to change the rule first.
4. Run `pnpm ai:validate`.

## Removing

If a skill turns out to overlap with one of our rules, or its guidance contradicts ours, remove the entry and note the reason in the PR description. Our rules win.
