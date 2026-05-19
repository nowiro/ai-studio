---
mode: agent
description: Sync technical docs with current code — doc-writer pass against the diff since last release
tools: ['editFiles', 'search', 'runCommands']
---

# Sync docs

Run a doc-writer pass against the diff between the current `main` and the last tagged release. The agent updates `docs/technical/`, `docs/programming/`, `docs/architecture/`, and `docs/ai-workflow/` to reflect the current code — without inventing facts.

## What to do

1. Switch to **doc-writer** chat mode (or follow the role inline). Load `.ai/agents/doc-writer.md`, `.ai/rules/language.md` (Polish for these surfaces), `.ai/rules/principles.md`.
2. Compute the diff window: `git log --oneline $(git describe --tags --abbrev=0)..HEAD`.
3. For each commit in scope, identify which doc surfaces it touches (per the doc-writer role's "Update triggers"):
   - Public-API change (component selector, service method, route, schema) → update `docs/technical/`.
   - Accepted ADR → turn it into a "How it works" entry in `docs/architecture/` or `docs/technical/`.
   - New agent / workflow in `.ai/` → mirror summary in `docs/ai-workflow/`.
   - Lint / link-check drift → fix in place.
4. **Verify before rewriting** — open the touched code; trust the file, not the doc.
5. Apply diffs (not rewrites) where the doc only drifted in part.
6. Run `pnpm docs:lint` and `pnpm ai:validate` to confirm well-formedness.
7. Open a single PR `docs: sync against vX.Y.Z` with a bullet list of changed docs.

## Don't

- Invent facts. If a doc claims something that's not in the code, **delete the claim** rather than rewriting it.
- Bundle structural changes (renamed sections, new pages) — those go through `regenerate-docs` after `audit-docs`.
- Touch analytical specs (analyst owns those) or ADRs (architect owns those).
