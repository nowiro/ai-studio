---
id: docs.tire-shop.business
title: Tire-shop — business documentation
type: business
status: living
date: 2026-05-18
audience: [product, analyst, sales, stakeholder]
links:
  spec: ../../analytical/specs/tire-shop/spec.md
  hub: README.md
---

# Tire-shop — business documentation

> The "what and why" view. Tech choices live in [`technical.md`](technical.md);
> acceptance criteria are canonical in [`spec.md`](../../analytical/specs/tire-shop/spec.md).

## Value proposition

A reference implementation of an e-commerce front-end demonstrating that
AI-assisted Angular delivery can produce production-shaped output:

- **Faceted search + product detail + cart + multi-step checkout** —
  the canonical shape of every B2C catalogue (Allegro, Empik,
  Media Expert).
- **Frontend-only** — runs without a backend so reviewers can poke at
  it without infra. The patterns drop cleanly onto any REST or GraphQL
  API layer.
- **Signal-first state** ([ADR-0006](../../adr/0006-tire-shop-state.md))
  — proves you don't need NgRx for a checkout flow.

Reusable for future demos: pick the catalogue UX, swap the domain
(tires → cosmetics / books / construction materials).

## Personas

Mirror [`spec.md`](../../analytical/specs/tire-shop/spec.md#personas-affected)
exactly so reviewers see no drift. Cliff-notes:

| ID        | Role                | Primary need                                                |
| --------- | ------------------- | ----------------------------------------------------------- |
| P-SHOPPER | Driver buying tires | Find a fitting set, compare on price + EU label.            |
| P-DEV     | Frontend developer  | Reference for facet UIs + cart + multi-step Reactive Forms. |
| P-TESTER  | Test engineer / QA  | Author E2E from `spec.md`; verify AC.                       |
| P-ANALYST | Product / Analyst   | Verify AC traceability and metrics; review scope cuts.      |
| P-DEVOPS  | DevOps / SRE        | App fits the standard Nx build/serve/e2e cadence.           |

## User journeys

### Journey 1 — Shopper finds a fitting tire set

1. **Discover** — visits `/`; sees 60 SKUs across 18 brands.
2. **Filter** — types `205 / 55 R 16` in the size inputs; result count
   chip drops to ~12 SKUs.
3. **Narrow** — clicks **Continental** + **Lato** in facets; 3 matches.
4. **Compare** — sorts by **EU label score**; top result has fuel
   grade `B`, wet `A`.
5. **Inspect** — opens product detail → gallery, spec table, "fits
   my car" tab.
6. **Add** — clicks **Do koszyka**; header badge shows `1`.
7. **Repeat** — buys 4 of the same SKU; quantity in cart adjusts to 4.

### Journey 2 — Shopper completes guest checkout

1. **Open cart drawer** — header cart icon → right slide-in.
2. **Review** — line items + line subtotals + grand total.
3. **Go to checkout** — `/checkout` route, 4-step Material stepper.
4. **Step 1: Contact** — first/last name, email, phone (PL regex).
5. **Step 2: Delivery** — courier / pickup-point / partner service;
   street + `00-000` postal code + city.
6. **Step 3: Invoice** — toggle "Chcę otrzymać fakturę"; NIP regex
   enforces 10 digits when toggled on.
7. **Step 4: Summary** — read-only recap + grand total.
8. **Place order** — confirmation screen with mock order number
   (`TS-<timestamp36>`), cart cleared.

### Journey 3 — Page reload keeps the cart

1. Add 2 tires to cart.
2. Reload `/`.
3. Cart badge still reads `2` (read from `localStorage` key
   `ais.tire-shop.cart.v1`).

## Feature inventory

| Feature                                        | Covered by AC | Notes                                  |
| ---------------------------------------------- | ------------- | -------------------------------------- |
| Catalogue with seeded 60-SKU dataset           | AC-1          | 18 brands, 3 seasons, 20+ sizes        |
| Brand facet (multi-select)                     | AC-2          | Count chip on each option              |
| Size facet (width / profile / diameter)        | AC-3          | 3 numeric inputs                       |
| EU label facet (fuel + wet grades)             | AC-2 (group)  |                                        |
| Season facet (lato / zima / cała)              | AC-2 (group)  |                                        |
| Price-range facet (min / max)                  | AC-2 (group)  |                                        |
| In-stock toggle                                | AC-2 (group)  |                                        |
| Sort by price asc / desc                       | AC-4          |                                        |
| Sort by EU label composite                     | AC-5          | `fuel_rank + wet_rank + noise/10`      |
| Sort by popularity / rating                    | AC-4 (group)  |                                        |
| Empty-state when 0 hits                        | AC-6          | "Wyczyść filtry" CTA                   |
| Product detail (gallery, specs, "fits my car") | AC-7          | Tabs: Specs / Fits / Description       |
| Cart persistence across reloads (localStorage) | AC-8          |                                        |
| Cart quantity adjust + remove                  | AC-9          |                                        |
| 4-step Reactive Forms checkout                 | AC-10         | Contact → delivery → invoice → summary |
| Unit-test gate (≥ 80% / ≥ 75% branches)        | AC-11         | Pure logic in `tire-data/filters/`     |
| Playwright happy-path E2E                      | AC-12         | `apps/tire-shop-e2e/`                  |

## Non-goals (out of scope for this demo)

Verbatim from [`spec.md`](../../analytical/specs/tire-shop/spec.md#non-goals):

- Real backend / inventory API.
- Real payments (Stripe / PayU / Przelewy24).
- User accounts / login (guest checkout only).
- Server-side rendering / Angular Universal.
- Email confirmations.
- Admin panel / inventory management.
- Mobile-app wrapper / PWA install banner v1.
- A/B test framework.

## KPIs and acceptance metrics

Tracked targets from [`spec.md` § Success metrics](../../analytical/specs/tire-shop/spec.md#success-metrics):

| Metric               | Target                                 | Status                                                             |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| Filter response time | < 50 ms on a mid-range laptop          | ✅ (~10 ms)                                                        |
| Dataset size         | 50–100 SKUs / ≥ 8 brands / ≥ 3 seasons | ✅ (60/18/3)                                                       |
| Bundle size delta    | < 350 KB gzip                          | ✅ (~140 KB)                                                       |
| Unit-test coverage   | ≥ 80% stmts / ≥ 75% branches           | ✅ (100% / 91%)                                                    |
| E2E coverage of AC   | every AC-N → ≥ 1 Playwright assertion  | ✅ ([matrix](testing.md#acceptance-criteria-to-test-traceability)) |

## Demo script (sales / showcase)

A reproducible 5-minute walkthrough. Used by sales for live demos and
by QA as the manual smoke test before each release.

| Step | Action                                              | Expected outcome                                      |
| ---- | --------------------------------------------------- | ----------------------------------------------------- |
| 1    | Open `<http://localhost:4205>`                      | Catalogue with 60 cards; filter panel on left.        |
| 2    | Click **Continental** under "Marka".                | Result count drops; only Continental cards remain.    |
| 3    | Set width=205, profile=55, diameter=16.             | ≤ 5 cards remain.                                     |
| 4    | Sort dropdown → "Cena: rosnąco".                    | Cards reorder by ascending price.                     |
| 5    | Click first card → product detail.                  | Gallery + spec table + EU label chips visible.        |
| 6    | Click **Dodaj do koszyka**.                         | Header cart badge increments to 1.                    |
| 7    | Click header cart icon.                             | Right drawer slides in with the line item + total.    |
| 8    | Click **Do kasy**.                                  | Route changes to `/checkout`; 4-step stepper visible. |
| 9    | Fill step 1 (contact) with valid data.              | "Dalej" enables; clicking advances to step 2.         |
| 10   | Fill step 2 (delivery: kurier / 00-100 / Warszawa). | Advance to step 3.                                    |
| 11   | Skip step 3 (no invoice).                           | Advance to step 4 (summary).                          |
| 12   | Click **Zamawiam i płacę**.                         | Confirmation: order number `TS-…`, cart cleared.      |
| 13   | Reload `/`.                                         | Cart badge gone (cart cleared on submit).             |

## Roadmap (post-demo)

Not blocking the demo Definition of Done, but documented to set expectations.

- **Localisation pipeline** — currently PL strings inline; extract to
  `@ai-studio/shared-language` toggle once a second locale is added.
- **Real catalogue API** — swap `TIRE_CATALOGUE` for an HTTP service.
  `CatalogueService` already isolates the source.
- **Authenticated checkout** — wire `AUTH_CONTEXT` (already used by
  library + journal) and prefill the contact step.
- **PWA install banner** — out of v1, but the CSP already allows the
  necessary `manifest`.
- **A/B harness** — GrowthBook flag wrapping facet logic.

## Glossary

| Term          | Meaning                                                              |
| ------------- | -------------------------------------------------------------------- |
| **SKU**       | Stock-keeping unit — one tire model in one size.                     |
| **Facet**     | A filter dimension (brand, size, season, EU label, price, in-stock). |
| **EU label**  | EU tire label (fuel grade A–E, wet grade A–E, drive-by noise dB).    |
| **Fitment**   | Width × profile × diameter combination that fits a given wheel.      |
| **Grosze**    | PLN minor unit (1/100 zł); prices stored as integer grosze.          |
| **Cart line** | One `{ tireId, quantity }` tuple in the cart signal.                 |
