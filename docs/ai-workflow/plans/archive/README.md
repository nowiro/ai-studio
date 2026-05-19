---
id: docs.ai-workflow.plans.archive
title: Plan archive
type: index
status: living
date: 2026-05-19
---

# Plan archive

> Plans that reached a terminal state (`done`, `aborted`, `superseded`). Kept for the audit trail — every artefact shipped by `ai-studio` traces back to an accepted plan here.

## Layout

```
archive/
└── <YYYY-MM>/
    └── <YYYY-MM-DD>-<slug>.md     # original plan, with closedAt + closeReason in frontmatter
```

Move a plan here once `status` is no longer in `{draft, accepted, in-progress}`. The orchestrator does this as the last step of a session (or via the `/release` flow when shipping a milestone).

## Current archive

- [`2026-05/`](2026-05/) — 25 plans closed during the 2026-05-19 audit cleanup (bootstrap, BPMN/skills delivery, per-app next-iteration roadmaps).

## Why archive instead of delete

- The plan's `Tasks (DAG)` is the canonical decomposition of the work — useful when the same shape needs revisiting (e.g. "build another faceted shop demo" reuses the `bookstore` plan as a starting template).
- `closeReason` documents what was actually delivered vs the plan, so the audit trail stays honest.
- Conventional Commit messages reference the plan path; broken links are unhelpful.

## Active plans

If a new plan opens, it lands directly in `docs/ai-workflow/plans/<YYYY-MM-DD>-<slug>.md` next to `_template.md` — never inside `archive/`.
