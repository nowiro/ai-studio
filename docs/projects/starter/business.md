---
id: docs.starter.business
title: Starter — business / product view
type: project
status: done
date: 2026-05-29
links:
  hub: README.md
---

# Starter — business view

## Why it exists

The starter app is **infrastructure, not a product**. It serves two audiences:

- **New-app authors** — a known-good skeleton to copy when spinning up a new
  domain app, so every app starts from the same Angular 21 + Material 3 +
  Tailwind v4 baseline instead of being assembled from scratch.
- **Reviewers / designers** — a single page where the workspace design tokens are
  visible at a glance: colour roles, type scale, spacing. If a token regresses
  workspace-wide (e.g. the Tailwind bridge breaks), it shows here first.

## Success criteria

- A new app copied from the starter boots, is themed, and passes lint / typecheck /
  build / e2e with no edits beyond rename + palette + port.
- The token showcase renders every Material 3 colour role and type-scale row.
- No domain logic, no data services, no backend coupling — it stays generic.

## Out of scope

Real users, persistence, auth, analytics. The starter never grows a domain.
