---
description: Phase 2 of spec-driven flow — architect writes plan.md (tech & architecture)
argument-hint: <feature-slug, optional — defaults to most-recent spec dir>
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Agent
---

Run **Phase 2** of [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md).

Target slug: $ARGUMENTS (if empty, pick the most recent dir under `docs/analytical/specs/`).

Spawn the **architect** subagent. Instruct it to:

1. Refuse if `spec.md` still has `[?]` markers — route to `/clarify` first.
2. Load `.ai/rules/principles.md` + `.ai/rules/{angular,nx,security,testing}.md` + the spec.
3. Use the `nx` MCP server to inspect the current project graph and `context7` for Angular docs.
4. Write `docs/analytical/specs/<slug>/plan.md` with: tech additions, module taxonomy (apps/libs targets + tags), public API surface, data model, risks + mitigations, generator plan (exact `nx generate …` commands).
5. If the change warrants an ADR, draft `docs/adr/NNNN-<slug>.md` as `Status: proposed`.

End-of-turn: present the plan summary; ask the user to accept before `/tasks`.
