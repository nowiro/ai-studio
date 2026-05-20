---
applyTo: '**/*.md'
description: PL/EN split — Polish for prose, English for code, git, tooling-readable surfaces
---

# Preferencje językowe (Copilot scope: każdy plik markdown)

Pełny tekst: [`.ai/rules/language.md`](../../.ai/rules/language.md).

> Trinity baseline v2.0.0. Polski dla prozy. English dla kodu / nazw / toolingu / MCP descriptions.

## Reguła kciuka

> _Czy to nazwa / identyfikator / czytane przez tooling (git, CI, LLM przy `list_tools`, monitoring JSON)?_ → **English**.
> _Wszystko inne (proza, instrukcje, uzasadnienia, opisy dla człowieka)?_ → **Polski**.

## Quick lookup

| Surface                                                                                      | Language    |
| -------------------------------------------------------------------------------------------- | ----------- |
| Chat z Claude / Copilot                                                                      | **Polski**  |
| `docs/technical/`                                                                            | **Polski**  |
| `docs/architecture/`                                                                         | **Polski**  |
| `docs/analytical/specs/<slug>/{spec,plan,tasks}.md`                                          | **Polski**  |
| `docs/ai-workflow/plans/` · `docs/ai-workflow/runs/`                                         | **Polski**  |
| `docs/adr/`                                                                                  | **Polski**  |
| `CHANGELOG.md`                                                                               | **Polski**  |
| `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md`                      | **Polski**  |
| `.ai/rules/`, `.ai/agents/`, `.ai/workflows/`, `.ai/prompts/`, `.ai/context/` proza          | **Polski**  |
| `.github/copilot-*`, `.github/instructions/`, `.github/prompts/`, `.github/chatmodes/` proza | **Polski**  |
| Kod (TS / JS / HTML / SCSS) + JSDoc + code comments                                          | **English** |
| Test names, fixture data                                                                     | **English** |
| MCP tool `description`                                                                       | **English** |
| Error / `throw` messages, structured log entries                                             | **English** |
| Git: branch · commit · PR title · PR body                                                    | **English** |
| `package.json` fields, frontmatter keys (`id:`, `type:`, `scope:`, `applyTo:`)               | **English** |
| `LICENSE`                                                                                    | **English** |

## Mixed files

- ✅ Polska proza + English code blocks / JSDoc / CLI commands.
- ✅ Polska proza + English file paths w backtickach.
- ❌ Alternujące paragrafy PL/EN — refactor do jednego języka.

## Migration

- **Istniejące angielskie dokumenty zostają.** Ta reguła stosuje się do nowych dokumentów ORAZ jest migrowana partiami przy refactorach (zgodnie z PLAN.md v0.2 fazami).
- Trinity baseline (8 plików byte-identical w 3 repo) jest migrowany synchronicznie.

## Czemu ten plik jest sam w angielsko-polskim mixie

To wrapper Copilot, czytany przez GitHub Copilot tooling. Frontmatter (`applyTo`, `description`) zostaje EN — to surface tooling-readable. Body jest PL — to proza dla zespołu. Trinity baseline language.md v2.0.0 — patrz `.ai/rules/language.md` po pełną politykę.
