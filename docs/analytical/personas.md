# Personas (human-readable)

> Mirrors `.ai/context/personas.md` but reads like a 1-pager — meant for stakeholders, not agents. Update both files together.

## P-001 Engineering Lead

- Wants reliable shipping; reads ADRs and run logs first thing.
- Pain: PRs blocked on unclear conventions.
- KPI: lead time from issue to merge.

## P-002 Frontend Engineer

- Spends most of the day in VS Code with Angular Language Service.
- Pain: AI never stops suggesting forbidden patterns like `*ngIf` / `@HostBinding` from older Angular.
- KPI: failed-PR rate.

## P-003 QA / Test Engineer

- Lives in Playwright UI mode and the Vitest watcher.
- Pain: flaky selectors, slow E2E.
- KPI: CI flake rate, E2E wall-clock.

## P-004 Product Analyst

- Bridges business asks and developer specs.
- Pain: re-doing scope when devs disagree.
- KPI: ratio of specs that ship without re-scope.

## P-005 Tech Writer

- Owns docs accuracy.
- Pain: docs drifting silently.
- KPI: % public-API PRs with doc update.

## P-006 Security Engineer

- Reviews auth / sanitisation / dependency / CSP / AI surfaces.
- Pain: AI code that bypasses sanitisation.
- KPI: time-to-remediation on `audit: fail` findings.
