---
applyTo: '**/*.md'
description: PL/EN split — Polish for team docs, English for code, git, tooling-readable surfaces
---

# Language preference (Copilot scope: every markdown file)

Full text: [`.ai/rules/language.md`](../../.ai/rules/language.md).

> Trinity baseline. Polish for what the team reads. English for what the LLM / git / CI / OSS contributor reads.

## Rule of thumb

> _Czy LLM / git / CI to przeczyta?_ → **English**.
> _Czy zespół przeczyta to dla kontekstu lub uzasadnienia?_ → **Polish**.

## Quick lookup

| Surface                                                                                            | Language    |
| -------------------------------------------------------------------------------------------------- | ----------- |
| Chat with Claude / Copilot                                                                         | **Polish**  |
| `docs/technical/`                                                                                  | **Polish**  |
| `docs/architecture/`                                                                               | **Polish**  |
| `docs/analytical/specs/<slug>/{spec,plan,tasks}.md`                                                | **Polish**  |
| `docs/ai-workflow/plans/` · `docs/ai-workflow/runs/`                                               | **Polish**  |
| `docs/adr/`                                                                                        | **Polish**  |
| `CHANGELOG.md`                                                                                     | **Polish**  |
| Code (TS / JS / HTML / SCSS) + JSDoc + code comments                                               | **English** |
| Test names, fixture data                                                                           | **English** |
| MCP tool `description`                                                                             | **English** |
| Error / `throw` messages, structured log entries                                                   | **English** |
| Git: branch · commit · PR title · PR body                                                          | **English** |
| `.ai/rules/` (except this file's source), `.ai/agents/`, `.ai/workflows/`                          | **English** |
| `README.md` (intro/quickstart), `SECURITY.md`, `CONTRIBUTING.md`, `LICENSE`                        | **English** |
| `.github/copilot-instructions.md`, `CLAUDE.md`, `.github/ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE` | **English** |

## Mixed files

- ✅ Polish prose + English code blocks / JSDoc / CLI commands.
- ✅ Polish prose + English file paths in backticks.
- ❌ Alternating PL/EN paragraphs — refactor to one language.

## Migration

- **Existing English documents stay.** This rule applies to new documents.
- Trinity baseline (`.ai/rules/{core,principles,security,production-readiness}.md`, `.ai/architecture.md`, `.ai/agents/orchestrator.md`, `.ai/workflows/spec-driven.md`, `bootstrap.mjs`, `_template.md`) stays in English — read by tooling across repos.
- You may translate opportunistically when refactoring a tech/project doc; it's optional.

## Why this file is itself in English

This is the Copilot wrapper, read by GitHub Copilot tooling. The canonical PL explanation lives in [`.ai/rules/language.md`](../../.ai/rules/language.md) (which is itself written in Polish — it eats its own dogfood per the rule "team docs in PL").
