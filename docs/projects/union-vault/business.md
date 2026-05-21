---
id: docs.projects.union-vault.business
title: Union-vault — business documentation (placeholder)
type: business
status: under-review
date: 2026-05-19
---

# Union-vault — business documentation

> **Status: under review.** Definitive content lands when the analyst spec at `docs/analytical/specs/union-vault/spec.md` is accepted (per (historic, see git log) plan task T001).

## Observed scope (from code review on 2026-05-19)

The app tree under `apps/union-vault/src/app/` shows:

- `components/` — UI building blocks (specific roster pending analysis).
- `pages/` — multiple route-level views.
- `data/` — local data layer.
- `i18n/` — internationalisation support is wired in.

Combined with `apps/union-vault-e2e/`, the app has the same shape as the demo apps in the workspace and is intended as a first-class deliverable.

## Pending decisions

1. Primary persona (who is this for).
2. Headline use case (one sentence).
3. Whether the demo should integrate with `apps/portal` MFE host.
4. Whether to keep i18n bundles or drop them until the persona is confirmed.

Until those land, treat this page as informational only.
