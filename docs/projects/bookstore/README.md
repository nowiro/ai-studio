---
id: docs.bookstore
title: Bookstore — documentation hub
type: project
status: done
date: 2026-05-18
links:
  hub: ../README.md
  app: ../../../apps/bookstore
  port: 4208
  bpmn: ../../bpmn/bookstore-purchase.bpmn
---

# Bookstore

> E-commerce demo selling books. Faceted catalogue (genre / language /
> format / price), cart with localStorage persistence, generic 4-step
> Reactive-Forms checkout — all built on the shared `shop-core` + `shop-ui`
> primitives.

|               |                                                                           |
| ------------- | ------------------------------------------------------------------------- |
| **Status**    | ✅ done                                                                   |
| **Port**      | `4208`                                                                    |
| **Start**     | `pnpm start:bookstore` → <http://localhost:4208>                          |
| **Scope tag** | `scope:bookstore`                                                         |
| **Stack**     | Angular 21 · Material 3 · Tailwind v4 · signals · `shop-core` + `shop-ui` |

## Audience routing

| You are…               | Start here                     |
| ---------------------- | ------------------------------ |
| **Product / analyst**  | [`business.md`](business.md)   |
| **Frontend / DevOps**  | [`technical.md`](technical.md) |
| **Test engineer / QA** | [`testing.md`](testing.md)     |

## Quickstart

```bash
pnpm install
pnpm start:bookstore
# → http://localhost:4208

pnpm nx run-many -t lint typecheck build --projects=bookstore,bookstore-data,bookstore-feature-catalogue
pnpm nx e2e bookstore-e2e
```

## Demo in 60 seconds

1. Open `/` — 30 books across 6 genres / 5 languages / 3 formats.
2. Click **Fantasy** under "Gatunek" — narrows to fantasy titles.
3. Click **EN** under "Język" — narrows further.
4. Sort dropdown → **Cena: rosnąco**.
5. Click any product card → book detail with full bibliographic info.
6. Click **Dodaj do koszyka** → header badge increments.
7. Click cart icon → drawer slides in → **Do kasy**.
8. Complete the 4-step checkout (shared `<ais-shop-checkout>`).

## Project map

```
apps/
  bookstore/                          port 4208
  bookstore-e2e/                      Playwright smoke

libs/
  bookstore-data/                     Book extends BaseProduct + 30-book seed
  bookstore-feature-catalogue/        catalogue page + filter panel + book detail
```

Cart, drawer, checkout components reused from
[`@ai-studio/shop-ui`](../../../libs/shop-ui); cart state lives in
[`ShopCartService`](../../../libs/shop-core/src/services/cart.service.ts)
from `shop-core`. The bookstore provides `PRODUCT_LOOKUP` →
`BookstoreCatalogueService` in `main.ts`.

## Related repo-wide docs

- [`docs/projects/README.md`](../README.md) — index + conventions.
- [`docs/projects/conventions.md`](../README.md#shop-core-shared-primitives)
  — shop-core / shop-ui contract.
