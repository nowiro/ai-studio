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
  - General design principles (hierarchy, contrast, spacing) + opinionated anti-pattern catalog (no Inter/Roboto, no purple-gradient AI-aesthetic). Useful gdy `frontend-developer` agent buduje greenfield UI z custom branding.
  - **⚠ M3 conflict watch**: Material 3 jest opinionated framework — fixed type scale (Roboto Flex), fixed color tokens, fixed motion specs. Ten skill wymusza bold aesthetic direction, co bije w sam fundament M3. **Installer guidance:** używaj ad-hoc dla pre-design exploration, nie dla codzienej feature pracy gdzie M3 tokens są authoritative. Anti-pattern list jest portable (wartość jako lockdown lista — patrz "Design lockdowns" niżej).
  - Install: `npx skillsadd anthropics/skills`

- **Web Interface Guidelines** — `vercel-labs/agent-skills/web-design-guidelines`
  - Audit UI code wg Vercel Web Interface Guidelines (design + a11y + UX) z `file:line` reporting. Fetchuje canonical raw guideline przy każdym review.
  - **Verdict: NOT installed.** Content źródłowy jest React/Next.js-centric (komponenty + klasy Tailwinda jako przykłady), koliduje z Material 3. Pattern "audit-against-canonical-source" jest jednak warty zaadaptowania jako workflow `audit-design.md` w `.ai/workflows/` (canonical source = nasz `angular-material-design` + `accessibility-a11y` + `styling.md`).

- **UI/UX Pro Max** — `nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max`
  - Design intelligence pack: 99 priority-ranked UX heuristics, 161 color palettes, 57 font pairings, 25 chart types, 161 product type patterns, 50+ design styles.
  - **Verdict: NOT installed.** Pakiet ma mocną zależność od **shadcn/ui** (Radix + Tailwind) — bezpośrednio konkuruje z naszym Material 3 (color palettes/font pairings konfliktują z `--mat-sys-*` tokens). Templates są React/shadcn-only. Wartość unikalna (99 UX heuristics) wymaga manual cherry-pick — większość duplikuje WCAG/M3 wytyczne.

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

## Design lockdowns (extracted from `frontend-design` 2026-05-20)

Lista anti-patterns wyekstraktowana z `anthropics/skills/frontend-design` — portable, aplikowalna nawet bez instalacji skilla. Reviewer powinien blockować PR-y wprowadzające te wzorce:

- ❌ **Google Sans / Inter / Roboto** jako "safe choice" dla custom branding. Material 3 ma Roboto Flex jako default, ale gdy app ma custom identity, wybierz świadomie (nie domyślnie sięgaj po Inter "bo Vercel").
- ❌ **Purple-to-pink gradients** (`from-purple-500 to-pink-500` style) — telltale "AI aesthetic", devaluuje brand.
- ❌ **Gradient-as-personality** — gradient jako jedyna decoration, bo "nowoczesne".
- ❌ **Centered hero + 3-column features + cta-card** layout — generic SaaS-template look (każdy startup w 2024 wyglądał tak).
- ❌ **Sparkle / starburst / "magic wand" icons** w UI nie-AI app — visual marker "AI-built generic".
- ❌ **Soft shadows + rounded-xl + light gradients wszędzie** — design równa-w-dół, no character.

Reviewerzy code-reviewer + frontend-developer cytują ten lockdown przy PR review (jak `DRY`/`SRP` z `principles.md`).
