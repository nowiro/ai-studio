---
id: docs.starter
title: Starter — documentation hub
type: project
status: done
date: 2026-05-29
links:
  hub: ../README.md
  app: ../../../apps/starter
  port: 4221
---

# Starter

> Reference Angular 21 app and **copy-me template** for new domain apps.
> A living showcase of the workspace design tokens: Material 3 colour roles,
> the M3 typography scale, and Tailwind v4 utilities — all wired through the
> same `styles/tailwind.scss` bridge every other app uses.

|               |                                                              |
| ------------- | ------------------------------------------------------------ |
| **Status**    | ✅ done                                                      |
| **Port**      | `4221`                                                       |
| **Start**     | `pnpm start:starter` → <http://localhost:4221>               |
| **Scope tag** | `scope:starter`                                              |
| **Theme**     | Material 3 — Azure primary · Rose tertiary                   |
| **Stack**     | Angular 21 · Material 3 · Tailwind v4 · signals · standalone |

## Audience routing

| You are…               | Start here                     |
| ---------------------- | ------------------------------ |
| **Product / analyst**  | [`business.md`](business.md)   |
| **Frontend / DevOps**  | [`technical.md`](technical.md) |
| **Test engineer / QA** | [`testing.md`](testing.md)     |

## Quickstart

```bash
pnpm install
pnpm start:starter
# → http://localhost:4221

pnpm nx run-many -t lint typecheck build --projects=starter
pnpm nx e2e starter-e2e
```

## What it shows

1. **Hero** — `Starter` H1 + intro copy on a themed surface.
2. **Colour token grid** (`color-token-grid`) — every Material 3 colour role as a
   swatch (`token-card-primary`, `…-secondary`, `…-surface`, …) so you can see the
   palette the app's `mat.theme()` produced.
3. **Typography list** (`typography-list`) — the M3 type scale, one row per role
   (`typography-row-display-large`, … `label-small`).
4. **Tailwind grid** (`tailwind-grid`) — utility-class layout proving the Tailwind
   v4 ↔ M3 token bridge resolves (`bg-primary`, `text-on-surface`, `rounded-*`, …).

## Use as a template

Copy `apps/starter` + `apps/starter-e2e`, rename the project + `scope:` tag, pick a
distinct M3 palette in `src/styles.scss` (`mat.$<palette>-palette`), and assign a
free port. Keep `styles/tailwind.scss` first in the `project.json` `styles` array —
it carries the global token bridge. See [`technical.md`](technical.md).

## Project map

```
apps/
  starter/                 port 4221 — token showcase
  starter-e2e/             Playwright smoke (sections render + no console errors)

libs/
  starter-feature/         showcase sections
  starter-ui/              presentational token-card / typography-row
```

## Related repo-wide docs

- [`docs/projects/README.md`](../README.md) — index + conventions.
- [`.ai/rules/styling.md`](../../../.ai/rules/styling.md) — Material 3 + Tailwind v4 contract.
