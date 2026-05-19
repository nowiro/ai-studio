---
id: docs.projects.nowiro.testing
title: Nowiro — testing
type: testing
status: living
date: 2026-05-19
---

# Nowiro — testing

## Test pyramid

```
                 ▲
                 │  E2E (Playwright)
                 │  - hero CTAs work, links not broken
                 │  - axe-core a11y assertions
                 │
                 │  Unit (Vitest via Angular 21 runner)
                 │  - component snapshot per section
                 ▼
```

## Files

```
apps/nowiro/src/app/
└── app.component.spec.ts

apps/nowiro-e2e/src/
└── hero.spec.ts
```

## Coverage gate

Per repo defaults (≥80/75/80/80 statements/branches/functions/lines). Nowiro has limited logic — coverage is mostly on `i18n/` and `services/`.

## Traceability matrix

| AC                                | Test                           | Layer |
| --------------------------------- | ------------------------------ | ----- |
| Hero CTA renders all four buttons | `app.component.spec.ts`        | unit  |
| CTA navigation works              | `apps/nowiro-e2e/hero.spec.ts` | e2e   |
| Axe-core: zero serious violations | `apps/nowiro-e2e/a11y.spec.ts` | e2e   |
