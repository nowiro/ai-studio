---
id: adr.0006
title: Tire-shop state strategy — signals + services + localStorage
status: accepted
date: 2026-05-18
deciders: [architect, frontend-developer]
supersedes: null
superseded-by: null
links:
  plan: ../ai-workflow/plans/2026-05-18-tire-shop.md
  spec: ../analytical/specs/tire-shop/spec.md
---

# ADR-0006 — Tire-shop state strategy

## Context

The tire-shop demo needs cross-page state: cart contents (drawer in
header + dedicated cart page + 4-step checkout) and "last viewed" tires.
The catalogue page itself owns transient facet state.

We considered three approaches:

1. **NgRx Store** — full Redux DevTools, time-travel, opinionated.
2. **NgRx SignalStore** — newer, signal-native, less boilerplate than Store.
3. **Plain Angular signals + injectable services** — zero extra deps.

## Decision

**Use plain Angular signals + injectable services + localStorage.**

`CartService` exposes `lines`, `total`, `count` as `WritableSignal`s.
Mutations go through methods (`addLine`, `removeLine`, `setQuantity`,
`clear`). After every mutation, the service writes the snapshot to
`localStorage` under a versioned key. On `provideAppInitializer`, it
reads back. `CatalogueService` keeps the facet state likewise — facets +
selected sort piped into a `filteredTires = computed(...)` signal.

## Rationale

- **No new runtime dependency.** Both NgRx variants would add weight to
  a 50–100 SKU demo; signals are already part of Angular 21.
- **Mirrors `union-vault`'s pattern.** That app uses signal services
  (`CountryService`, `LocalizationService`) for cross-page state and the
  team is already fluent in it.
- **`computed()` covers derived state.** Cart total, filtered list,
  facet counts — all natural fits for `computed()`. We do not need
  effects-driven workflows.
- **localStorage adapter is ~20 lines.** A trivial JSON serialiser keyed
  by `ai-studio.tire-shop.cart.v1`. Versioned key keeps future migration
  options open.
- **YAGNI on Redux DevTools.** Useful when teams >5 work on the same
  store; for a demo, signal inspection in DevTools + plain `console.log`
  is enough.

## Consequences

### Positive

- Zero new runtime deps (`@ngrx/*` not added).
- Same mental model as the rest of the repo (services + signals).
- Unit tests are dead simple: instantiate the service, call methods, assert signals.

### Negative

- Cross-tab sync (if a user has two tabs open) requires a
  `storage`-event listener wired manually. For v1 we accept the
  single-tab limitation — checkout is a one-tab flow.
- No time-travel debugger. If the demo grows, we may revisit (this ADR
  is then **superseded-by** a future ADR).

## Alternatives considered

### NgRx Store

- Pros: well-known pattern, DevTools.
- Cons: ~25 KB of runtime, action/reducer/effect ceremony for one cart.
- Verdict: rejected — overkill for a demo.

### NgRx SignalStore

- Pros: signal-native, less boilerplate.
- Cons: still an extra package to learn, adds versioning surface.
- Verdict: rejected — pure signals do the job at zero cost.

## Compliance

- `libs/tire-data` exposes only signals + service methods. No
  `BehaviorSubject`, no `RxJS Store`.
- `cart.service.ts` writes to `localStorage` on every mutation; the key
  is `ais.tire-shop.cart.v1` (lowercase, dot-separated, versioned).
- `catalogue.service.ts` exposes `tires`, `filtered`, `facets` as
  read-only signals.

## Links

- Spec: [`../analytical/specs/tire-shop/spec.md`](../analytical/specs/tire-shop/spec.md)
- Plan: [`../ai-workflow/plans/2026-05-18-tire-shop.md`](../ai-workflow/plans/2026-05-18-tire-shop.md)
- Pattern reference: `apps/union-vault/src/app/services/country.service.ts`
