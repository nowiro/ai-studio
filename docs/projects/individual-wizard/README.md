---
id: docs.projects.individual-wizard
title: Individual-wizard — personal-data reactive-forms survey
type: project-hub
status: living
date: 2026-05-18
links:
  bpmn: ../../bpmn/individual-wizard-submit.bpmn
---

# Individual-wizard

> 5-step reactive-forms wizard collecting personal data (PESEL, NIP, contact,
> education, employment, consents). Sibling of `business-wizard` — both share
> `libs/wizard-core` for the generic mechanics (form helpers, status
> computation, tile descriptors). Only the domain schema, dictionaries and
> consents catalog differ between them.

## Quickstart

```bash
# Standalone SPA (port 4203)
pnpm start:individual-wizard
```

## Status

| Validator | Status                                                     |
| --------- | ---------------------------------------------------------- |
| lint      | ✅                                                         |
| typecheck | ✅                                                         |
| test      | ✅ (30 tests in `libs/individual-wizard-data` + dev-tools) |
| e2e       | ✅ (Playwright in `apps/individual-wizard-e2e`)            |
| build     | ✅                                                         |

## Layout

```
apps/individual-wizard/                       (scope:wizard, type:app · port 4203)
  └ src/{main.ts,app/{app.component,app.routes}}.ts

libs/individual-wizard-data/                  (scope:wizard, type:data-access)
  ├ src/models.ts                             (PersonalData + sub-types)
  ├ src/dictionaries.ts                       (countries, education levels, etc.)
  ├ src/cross-validators.ts                   (PESEL ↔ DoB, NIP-for-self-employed)
  ├ src/consents-catalog.ts                   (RODO / marketing — citizenship-driven)
  ├ src/form-helpers.ts                       (ROOT_PATHS · re-exports asGroup/asArray/asControl from wizard-core)
  ├ src/wizard-form.factory.ts                (FormGroup tree + conditional wiring)
  ├ src/wizard-form.service.ts                (signal-backed singleton)
  └ src/wizard-routes.ts                      (WizardPath + WizardNav)

libs/individual-wizard-feature/               (scope:wizard, type:feature)
  ├ src/wizard-dashboard/                     (5 tiles with completion chips — uses computeWizardStatus)
  ├ src/wizard-shell/                         (MatStepper + route-bound :step)
  └ src/steps/                                (step-basic-data, step-contact, step-survey,
                                               step-consents, step-summary)

libs/individual-wizard-ui/                    (scope:wizard, type:ui)
  └ Address form · consent row · form error  (consumed by step components)

libs/individual-wizard-dev-tools/             (scope:wizard, type:feature)
  └ <ais-dev-fab> floating panel for filling the entire form with fixtures
```

Sibling tools used:

- `libs/wizard-core` — generic helpers (asGroup/asArray/asControl, computeWizardStatus, WizardTileDescriptor) shared with business-wizard
- `libs/wizard-util-validators` — NIP/PESEL/polish-phone/postal-code/age validators
- `libs/wizard-util-pdf` — PDF export (consumed by step-summary)

## Documentation contract

| File                           | Audience          | Owns                                     |
| ------------------------------ | ----------------- | ---------------------------------------- |
| [`README.md`](README.md)       | Anyone            | Navigation, quickstart, status           |
| [`business.md`](business.md)   | PM, analyst       | Personas, journey, fields, KPIs          |
| [`technical.md`](technical.md) | Developer, DevOps | Architecture, libs, public APIs, runbook |

(Testing.md → uses Playwright suite in `apps/individual-wizard-e2e`.)

## Related ADRs

- [ADR-0011](../../adr/0011-ui-kit-wrapper-strategy.md) — once landed, Material consumers in `libs/individual-wizard-ui` migrate to `<ais-…>` wrappers.

## Sibling project

[`business-wizard`](../business-wizard/README.md) — 6-step B2B variant with Web Component build. Both share `libs/wizard-core`.
