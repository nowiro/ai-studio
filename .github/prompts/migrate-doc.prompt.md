---
mode: agent
description: Migrate a single legacy doc to the AI Studio template
tools: ["editFiles", "search", "runCommands"]
---

# Migrate doc

Convert one legacy document to the canonical template under `docs/` (or `.ai/`).

## Inputs

- `${input:source:Path to the legacy doc}` — where the input lives
- `${input:target:Target directory under docs/ or .ai/}` — where the new doc should land
- `${input:type:Doc type (technical|analytical|programming|ai-workflow|adr|spec|rule|agent|workflow|prompt|context)}`

## What to do

1. Load `.ai/agents/doc-auditor.md` (the migration agent).
2. Read the source file. Extract:
   - Intent (what is this doc for?)
   - Audience (engineer / analyst / agent / reviewer)
   - Concrete facts (file paths, commands, code snippets)
   - Stale claims (anything that contradicts current code — flag, don't carry over)
3. Pick the canonical template:
   - Technical doc → see [`docs/technical/`](../../docs/technical/) skeletons.
   - Analytical spec → [`.ai/agents/analyst.md`](../../.ai/agents/analyst.md) skeleton.
   - ADR → [`docs/adr/0000-template.md`](../../docs/adr/0000-template.md).
   - Agent role → frontmatter + the role's standard sections (see existing files in `.ai/agents/`).
   - Workflow / prompt / rule → mirror the closest existing file's structure.
4. Produce the new file at `${target}` with proper frontmatter and the template skeleton populated.
5. Add a one-line entry to the relevant index (`docs/README.md`, `.ai/README.md`, or analogous).
6. Run `pnpm ai:validate` to confirm the new file is well-formed.

## Don't

- Carry stale facts forward without verifying them against current code.
- Skip the frontmatter — the validator will fail.
- Delete the source file (the human decides when to retire it).
