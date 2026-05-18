---
id: docs.toy-shop
title: Toy-shop — documentation hub
type: project
status: done
date: 2026-05-18
links:
  hub: ../README.md
  app: ../../../apps/toy-shop
  port: 4210
---

# Toy-shop

> E-commerce demo selling toys. Faceted catalogue (category / age group
> / battery-free / price), generic cart + 4-step checkout from
> `shop-ui`.

|               |                                                                           |
| ------------- | ------------------------------------------------------------------------- |
| **Status**    | ✅ done                                                                   |
| **Port**      | `4210`                                                                    |
| **Start**     | `pnpm start:toy-shop` → <http://localhost:4210>                           |
| **Scope tag** | `scope:toy-shop`                                                          |
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
pnpm start:toy-shop
# → http://localhost:4210

pnpm nx run-many -t lint typecheck build --projects=toy-shop,toy-shop-data,toy-shop-feature-catalogue
pnpm nx e2e toy-shop-e2e
```

## Demo in 60 seconds

1. Open `/` — 28 toys.
2. Click **Klocki** under "Kategoria".
3. Click **3–5 lat** under "Wiek".
4. Check **Bez baterii**.
5. Sort dropdown → **Cena: rosnąco**.
6. Open the first card → toy detail with age range / piece count /
   battery-required / CE-certified chips.
7. Add to cart → checkout → confirmation.

## Project map

```
apps/
  toy-shop/                          port 4210
  toy-shop-e2e/                      Playwright smoke

libs/
  toy-shop-data/                     Toy extends BaseProduct + 28-toy seed
  toy-shop-feature-catalogue/        catalogue page + filter panel + toy detail
```

## Related repo-wide docs

- [`docs/projects/README.md`](../README.md) — index + conventions.
