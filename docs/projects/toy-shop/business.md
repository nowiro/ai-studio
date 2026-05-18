---
id: docs.toy-shop.business
title: Toy-shop — business documentation
type: business
status: living
date: 2026-05-18
audience: [product, analyst, sales, stakeholder]
links:
  hub: README.md
---

# Toy-shop — business documentation

> The "what and why" view for the toy shop demo.

## Value proposition

A demo of an e-commerce front-end for **child-safety-aware products**.
Tests whether the shared `shop-core` + `shop-ui` libs handle a domain
with **age gating** and **safety attributes** cleanly:

- **Age-group facet** — `0-2 / 3-5 / 6-8 / 9-12 / 13+` (a domain axis
  that doesn't exist in tire-shop / bookstore / tools-shop).
- **Battery-free filter** — practical UX for parents.
- **CE-certification chip** on the detail page.
- **Piece-count** displayed where applicable (Lego, Magformers, Lego
  Technic Bugatti Chiron with 3599 pieces).

Demonstrates that the **shared cart, drawer, checkout and product card**
absorb a wildly different brand set (Lego, Mattel, Hasbro, Asmodee,
Ravensburger, Trefl, Crayola, Razor, Steiff…) without any UI change.

## Personas

| ID            | Role               | Primary need                                        |
| ------------- | ------------------ | --------------------------------------------------- |
| P-PARENT      | Parent             | Find age-appropriate toys; battery-free preference. |
| P-GRANDPARENT | Grandparent        | Same as parent; less tech-comfortable.              |
| P-DEV         | Frontend developer | Reference for an age-gated domain.                  |
| P-TESTER      | Test engineer / QA | Author E2E from the demo script.                    |

## User journeys

### Journey 1 — Parent buys an age-appropriate building toy

1. **Browse** — visits `/`; 28 toys.
2. **Filter category** — clicks **Klocki** → 5 sets.
3. **Filter age** — clicks **3–5 lat** → 2 sets (Lego Classic +
   Magformers).
4. **Filter battery-free** — both sets are already battery-free.
5. **Open detail** — Magformers, 30 magnetic pieces, CE certified.
6. **Add to cart** → checkout → done.

### Journey 2 — Gift for a 10-year-old

1. **Filter age** — **9–12 lat** → 6 toys.
2. **Sort** — **Najwyżej oceniane** → educational toys at the top.
3. Picks the National Geographic microscope (`12+`).
4. Adds to cart with quantity 1; total 249,00 zł.

## Feature inventory

| Feature                                  | Notes                                         |
| ---------------------------------------- | --------------------------------------------- |
| Catalogue with 28 toys (9 categories)    | `libs/toy-shop-data/src/seed/catalogue.ts`    |
| Category / age-group facets              | Toy-specific `ToyFilters` on `BaseFilters`    |
| Battery-free toggle                      | Bespoke predicate (`batteryFreeOnly`)         |
| Search (name / brand / tags)             | `shop-core`'s `matchesQuery`                  |
| Sort: popularity / price / rating / name | `shop-core`'s `sortProducts`                  |
| Generic product card with age chip       | `<ais-shop-product-card>` + age category chip |
| Toy detail page                          | Age range / piece count / battery / CE chips  |
| Cart + drawer + checkout                 | All from `shop-ui`                            |
| localStorage cart persistence            | `ais.toy-shop.cart.v1`                        |
| Playwright smoke E2E                     | `apps/toy-shop-e2e/src/smoke.spec.ts`         |

## Non-goals

- Real backend / inventory.
- Personalisation / age-based recommendations.
- Gift-wrapping option.
- Subscription boxes.

## Demo script

| Step | Action                                | Expected outcome                           |
| ---- | ------------------------------------- | ------------------------------------------ |
| 1    | Open `<http://localhost:4210>`        | 28 cards; facet panel.                     |
| 2    | Click **Klocki** category facet.      | Building toys only.                        |
| 3    | Click **3–5 lat** age facet.          | Narrows to 2-3 sets.                       |
| 4    | Toggle **Bez baterii**.               | Stays the same (those are battery-free).   |
| 5    | Open a card → detail.                 | Age range / CE chip / piece count visible. |
| 6    | Add to cart → checkout → place order. | Confirmation.                              |

## Roadmap

- Bundle deals (Lego Classic + storage box at a discount).
- Age-based recommendations on the detail page.
- Gift-wrapping checkbox in checkout.
- Wishlist (multi-user via mock-login profiles like the library demo).

## Glossary

| Term             | Meaning                                                          |
| ---------------- | ---------------------------------------------------------------- |
| **Toy**          | Domain product extending `BaseProduct`.                          |
| **Age group**    | `0-2 / 3-5 / 6-8 / 9-12 / 13+`.                                  |
| **Piece count**  | Number of pieces in a set; `null` for indivisible items (plush). |
| **CE certified** | EU toy safety certification.                                     |
