---
id: docs.projects.nowiro.technical
title: Nowiro — technical documentation
type: technical
status: living
date: 2026-05-19
---

# Nowiro — technical documentation

## Architecture

```
apps/nowiro/
├── src/
│   ├── app/
│   │   ├── app.component.{ts,html,scss}
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── components/
│   │   ├── services/
│   │   ├── shared/
│   │   └── i18n/
│   ├── main.ts
│   └── styles.scss
└── project.json
```

## Stack

- Angular 21 (standalone, OnPush, signals).
- Material 3 toolbar + buttons.
- Tailwind v4 utility classes (no `tailwind.config.js`; `@theme` in `styles/tailwind.scss`).
- No backend — purely client-side, content authored in component templates.

## Routes

`/` — single route, mostly composition of section components (hero, demos grid, footer).

## Build & serve

```bash
pnpm start:nowiro          # → http://localhost:4201
pnpm nx build nowiro       # production build
pnpm nx run nowiro:build-element  # ESM bundle for embedding
```

## Dependencies

Production: `@angular/*`, `tailwindcss`, `@angular/material`.
None of: data services, http client, ngrx — by design.

## References

- [`.ai/rules/angular.md`](../../../.ai/rules/angular.md)
- [`.ai/rules/styling.md`](../../../.ai/rules/styling.md)
