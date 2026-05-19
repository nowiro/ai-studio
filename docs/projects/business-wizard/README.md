---
id: docs.projects.business-wizard
title: Business-wizard — survey forms for B2B clients
type: project-hub
status: living
date: 2026-05-18
links:
  bpmn: ../../bpmn/business-wizard-submit.bpmn
  bpmn_secondary: ../../bpmn/web-component-embed.bpmn
---

# Business-wizard

> 6-step reactive-forms survey collecting B2B company data (legal identity,
> contact, profile, representatives, consents). Same architecture as
> `individual-wizard` but with business fields and B2B consents. Ships
> with a Web Component build target so the survey can be embedded into any
> non-Angular host page.

## Quickstart

```bash
# Standalone SPA (port 4212)
pnpm start:business-wizard

# Web Component bundle (no dev server — produces dist artifacts only)
pnpm build:business-wizard-element
# → dist/apps/business-wizard-element/{main.js,styles.css,polyfills.js,…}

# Embedded demo (serve dist + open element-demo.html alongside)
npx serve dist/apps/business-wizard-element
# then open apps/business-wizard/src/element-demo.html in a browser
```

## Status

| Validator | Status                                  |
| --------- | --------------------------------------- |
| lint      | ✅                                      |
| typecheck | ✅                                      |
| test      | ✅ (validators unit-tested in data lib) |
| e2e       | ⏸ (planned in follow-up)                |
| build     | ✅ (standalone + Web Component)         |

## Documentation contract

| File                           | Audience           | Owns                                                    |
| ------------------------------ | ------------------ | ------------------------------------------------------- |
| [`README.md`](README.md)       | Anyone             | Navigation, quickstart, status                          |
| [`business.md`](business.md)   | PM, analyst, sales | Personas, journey, B2B fields, KPIs                     |
| [`technical.md`](technical.md) | Developer, DevOps  | Architecture, libs, public APIs, Web Component contract |

(Testing.md will be added when E2E lands.)

## Layout

```
apps/business-wizard/                       (scope:wizard, type:app · port 4212)
  ├ src/main.ts                             (standalone SPA bootstrap)
  ├ src/element.ts                          (Web Component bootstrap → <ais-business-wizard>)
  ├ src/element-demo.html                   (demo host page for the WC bundle)
  └ src/app/{app.component.ts,app.routes.ts}

libs/business-wizard-data/                  (scope:wizard, type:data-access)
  ├ src/models.ts                           (BusinessData + sub-types)
  ├ src/dictionaries.ts                     (option lists)
  ├ src/validators.ts                       (REGON, KRS, URL — NIP reused from wizard-util-validators)
  ├ src/consents-catalog.ts                 (B2B consent applicability rules)
  ├ src/form-helpers.ts                     (ROOT_PATHS + asGroup/asArray/asControl)
  ├ src/wizard-form.factory.ts              (FormGroup tree + conditional wiring)
  ├ src/wizard-form.service.ts              (signal-backed singleton)
  └ src/wizard-routes.ts                    (BusinessWizardPath + BusinessWizardNav)

libs/business-wizard-feature/               (scope:wizard, type:feature)
  ├ src/wizard-dashboard/                   (6 tiles with completion chips)
  ├ src/wizard-shell/                       (MatStepper + route-bound :step)
  └ src/steps/                              (step-basics, step-contact, step-profile,
                                             step-representatives, step-consents,
                                             step-summary)
```

## Related ADRs

- [ADR-0012](../../adr/0012-app-dual-mode-web-components.md) — `bootstrapAsElement()`
  contract — business-wizard is the **first consumer** of this helper.
- [ADR-0013](../../adr/0013-keycloak-auth-integration.md) — the same
  `AUTH_CONTEXT` token applies if this wizard is gated behind login.

## Related plan

- [Consolidated roadmap](../../ai-workflow/plans/2026-05-18-portal-elements-keycloak.md)
  — Phase 1 of the roadmap is "dual-mode Web Components per app". This app
  ships the pattern landed in the previous turn (`bootstrapAsElement()`).
