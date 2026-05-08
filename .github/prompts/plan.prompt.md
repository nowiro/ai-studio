---
mode: agent
description: Phase 2 of spec-driven flow — architect writes plan.md (tech & architecture)
tools: ["editFiles", "search", "runCommands", "problems"]
---

# Plan (Phase 2 — SDD)

Run **Phase 2** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

## Inputs

- `${input:slug:Feature slug, leave empty for most-recent}` — target spec dir
- `${selection}` — optional code context

## What to do

1. Switch to the **architect** persona (load `.ai/agents/architect.md`).
2. Refuse if `spec.md` still has `[?]` markers — route the user to `/clarify` first.
3. Load `.ai/rules/principles.md` + `.ai/rules/{angular,nx,security,testing}.md` + the spec.
4. Inspect the current Nx graph; consult Angular docs for any unfamiliar API.
5. Write `docs/analytical/specs/<slug>/plan.md` with:
   - Tech additions (with ADR ref if non-trivial)
   - Module taxonomy — apps + libs targets and tags
   - Public API surface (`src/index.ts` exports)
   - Data model + contracts (link `contracts/` subdir for API design)
   - Risks + mitigations
   - Generator plan — exact `nx generate …` commands
6. If the change warrants an ADR, draft `docs/adr/NNNN-<slug>.md` as `Status: proposed`.

## Don't

- Decompose into tasks here — that's `/tasks`.
- Skip the generator plan. Hand-edited `project.json` is forbidden.

End-of-turn: present a 5-bullet plan summary and ask the user to accept before moving to `/tasks`.
