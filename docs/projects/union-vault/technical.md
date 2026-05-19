---
id: docs.projects.union-vault.technical
title: Union-vault — technical documentation (observed)
type: technical
status: under-review
date: 2026-05-19
---

# Union-vault — technical documentation

> Architecture observed in source on 2026-05-19. Subject to change after analyst spec lands.

## Observed structure

```
apps/union-vault/
├── src/
│   ├── app/
│   │   ├── app.component.{ts,html,scss,spec.ts}
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── components/         — reusable widgets
│   │   ├── data/               — local data layer
│   │   ├── i18n/               — locale bundles
│   │   └── pages/              — route-level components
│   ├── main.ts
│   └── styles.scss
└── project.json
```

## Stack

Standard ai-studio defaults: Angular 21 standalone, Material 3, Tailwind v4, signals, native control flow.

## Open questions

- Does the app belong to a feature library family (`libs/<name>-*`)? Audit did not surface a matching lib roster.
- Internationalisation: which locales are seeded, which is primary.

## References

- [`apps/union-vault/`](../../../apps/union-vault/) — source of truth until spec lands.
- [`.ai/rules/angular.md`](../../../.ai/rules/angular.md) — applies regardless of business scope.
