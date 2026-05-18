---
id: docs.bookstore.business
title: Bookstore — business documentation
type: business
status: living
date: 2026-05-18
audience: [product, analyst, sales, stakeholder]
links:
  hub: README.md
---

# Bookstore — business documentation

> The "what and why" view for the bookstore demo. Tech: [`technical.md`](technical.md).

## Value proposition

A reference implementation of a books e-commerce front-end that proves
the **shared `shop-core` + `shop-ui` libs** can host any product domain:

- **Same cart + drawer + checkout** as every other shop demo (tire-shop,
  tools-shop, toy-shop). One generic `ShopCartService` instance per app,
  keyed by `CART_STORAGE_KEY`.
- **Domain-specific facets** (genre / language / format / publication year)
  layered on top of the generic `BaseFilters`.
- **Bibliographic detail page** (author / ISBN / page count / format
  chips) that mirrors the tire-shop's spec table.
- **Multi-language seed dataset** — 5 languages (PL, EN, DE, FR, ES) ×
  10 genres, 30 books.

Reusable for: any catalogue domain where each product extends the
`BaseProduct` shape (clothing, electronics, groceries).

## Personas

| ID       | Role               | Primary need                                                 |
| -------- | ------------------ | ------------------------------------------------------------ |
| P-READER | Book buyer         | Find a title fast; compare formats + prices.                 |
| P-DEV    | Frontend developer | Reference for hosting a new domain on `shop-core`/`shop-ui`. |
| P-TESTER | Test engineer / QA | Author E2E from the demo script.                             |
| P-DEVOPS | DevOps / SRE       | App fits the standard Nx build/serve/e2e cadence.            |

## User journeys

### Journey 1 — Reader buys an English fantasy paperback

1. **Browse** — visits `/`; 30 titles in the grid.
2. **Filter genre** — clicks **Fantasy** → 7 books.
3. **Filter language** — clicks **EN** → 5 books.
4. **Filter format** — clicks **Miękka oprawa** → 3 books.
5. **Sort** — picks **Cena: rosnąco**.
6. **Open detail** — clicks "The Hobbit" → cover, author, year, ISBN,
   page count chips, description.
7. **Add to cart** — clicks **Dodaj do koszyka**.
8. **Checkout** — clicks header cart icon → drawer → "Do kasy" → 4-step
   stepper → confirmation `BS-…` order number.

### Journey 2 — Cart persists across reloads

1. Add 2 books to the cart.
2. Reload `/` — cart badge still reads `2`.
3. `localStorage` key: `ais.bookstore.cart.v1` (versioned).

## Feature inventory

| Feature                                           | Notes                                                    |
| ------------------------------------------------- | -------------------------------------------------------- |
| Catalogue with 30 books (5 languages, 10 genres)  | `libs/bookstore-data/src/seed/catalogue.ts`              |
| Genre / language / format / price facets          | Bookstore-specific `BookFilters` on top of `BaseFilters` |
| Search (title / author / ISBN / tags)             | Uses `shop-core`'s `matchesQuery`                        |
| Sort: popularity / price asc/desc / rating / name | `shop-core`'s `sortProducts`                             |
| Generic product card                              | `<ais-shop-product-card>` from `shop-ui`                 |
| Book detail page                                  | Cover + chips + add-to-cart                              |
| Cart drawer + cart page + 4-step checkout         | All `shop-ui` (zero duplication)                         |
| localStorage cart persistence                     | Key `ais.bookstore.cart.v1`                              |
| Playwright smoke E2E                              | `apps/bookstore-e2e/src/smoke.spec.ts`                   |

## Non-goals

- Real backend / inventory API.
- Real payments.
- User accounts / login (guest checkout only).
- Per-region pricing / VAT zones.

## Demo script (sales / showcase)

| Step | Action                              | Expected outcome                              |
| ---- | ----------------------------------- | --------------------------------------------- |
| 1    | Open `<http://localhost:4208>`      | Catalogue with 30 books; facet panel on left. |
| 2    | Click **Fantasy** facet.            | Result count drops; fantasy titles only.      |
| 3    | Click **EN** language facet.        | Narrows further.                              |
| 4    | Sort → **Cena: rosnąco**.           | Cards reorder ascending.                      |
| 5    | Open the first card.                | Book detail with cover + bibliographic info.  |
| 6    | Click **Dodaj do koszyka**.         | Header cart badge increments.                 |
| 7    | Click header cart icon → "Do kasy". | 4-step Material stepper visible.              |
| 8    | Fill steps 1-2-3, place order.      | Confirmation: order number `BS-…`.            |

## Roadmap

- Localisation pipeline (PL → EN) via `shared-language` toggle.
- Real catalogue API (swap `BOOK_CATALOGUE` for an HTTP-driven source).
- Wishlist + recently-viewed (extend `ShopCartService` or add a new
  signal service following the same pattern).
- Reviews module.

## Glossary

| Term       | Meaning                                                     |
| ---------- | ----------------------------------------------------------- |
| **Book**   | A domain product extending `BaseProduct` from `shop-core`.  |
| **Format** | `hardcover \| paperback \| ebook \| audiobook`.             |
| **ISBN**   | International Standard Book Number, 13 digits.              |
| **Grosze** | PLN minor unit (1/100 zł); prices stored as integer grosze. |
