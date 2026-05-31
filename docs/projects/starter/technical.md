---
id: docs.starter.technical
title: Starter — technical view
type: project
status: done
date: 2026-05-29
links:
  hub: README.md
  app: ../../../apps/starter
---

# Starter — technical view

## Theme wiring (the part to copy correctly)

Per-app theme lives in [`apps/starter/src/styles.scss`](../../../apps/starter/src/styles.scss):

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light;
  color: var(--mat-sys-on-surface);
  background: var(--mat-sys-surface-container);
  @include mat.theme(
    (
      color: (
        primary: mat.$azure-palette,
        tertiary: mat.$rose-palette,
      ),
      typography: Roboto,
      density: -1,
    )
  );
}
```

`mat.theme()` emits the `--mat-sys-*` system tokens. The workspace-wide
**Tailwind v4 ↔ M3 bridge** ([`styles/tailwind.scss`](../../../styles/tailwind.scss))
re-exports them as `--color-*` so `bg-primary` / `text-on-surface` resolve.

> **Pipeline contract:** `styles/tailwind.scss` MUST be the first entry in the
> app's `project.json` `styles` array, and Tailwind runs via the root
> [`postcss.config.json`](../../../postcss.config.json) (`@tailwindcss/postcss`).
> `@angular/build` only auto-discovers `postcss.config.json` / `.postcssrc.json`
> — a `.mjs`/`.js` PostCSS config is silently ignored and Tailwind emits nothing.

## Structure

```
apps/starter/src/
  main.ts            bootstrapApplication
  styles.scss        per-app mat.theme()
  app/               showcase shell + routes
libs/
  starter-feature/   showcase sections (color grid, typography, tailwind grid)
  starter-ui/        token-card, typography-row (presentational, OnPush, signals)
```

## Conventions inherited

Standalone components, `OnPush`, `inject()`, signal APIs, native control flow,
`ais-` selector prefix, `data-testid` on showcase landmarks. No `*ngIf`,
no `::ng-deep`, no hard-coded hex (use `var(--mat-sys-*)`).

## Build / serve

```bash
pnpm start:starter                       # nx serve starter --port 4221
pnpm nx run starter:build                # production bundle
pnpm nx run-many -t lint typecheck build --projects=starter
```
