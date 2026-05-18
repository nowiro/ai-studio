---
id: docs.tools-shop
title: Tools-shop — documentation hub
type: project
status: done
date: 2026-05-18
links:
  hub: ../README.md
  app: ../../../apps/tools-shop
  port: 4209
---

# Tools-shop

> E-commerce demo selling power and hand tools. Faceted catalogue
> (category / tool type / power source / price), generic cart + 4-step
> checkout from `shop-ui`.

|               |                                                                           |
| ------------- | ------------------------------------------------------------------------- |
| **Status**    | ✅ done                                                                   |
| **Port**      | `4209`                                                                    |
| **Start**     | `pnpm start:tools-shop` → <http://localhost:4209>                         |
| **Scope tag** | `scope:tools-shop`                                                        |
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
pnpm start:tools-shop
# → http://localhost:4209

pnpm nx run-many -t lint typecheck build --projects=tools-shop,tools-shop-data,tools-shop-feature-catalogue
pnpm nx e2e tools-shop-e2e
```

## Demo in 60 seconds

1. Open `/` — 29 tools across categories.
2. Click **Elektronarzędzia** under "Kategoria".
3. Click **Akumulatorowe** under "Zasilanie".
4. Sort dropdown → **Cena: malejąco**.
5. Open the first card → tool detail with type / power / voltage /
   weight / warranty chips.
6. Click **Dodaj do koszyka**.
7. Cart icon → drawer → **Do kasy** → 4-step checkout → confirmation.

## Project map

```
apps/
  tools-shop/                        port 4209
  tools-shop-e2e/                    Playwright smoke

libs/
  tools-shop-data/                   Tool extends BaseProduct + 29-tool seed
  tools-shop-feature-catalogue/      catalogue page + filter panel + tool detail
```

## Related repo-wide docs

- [`docs/projects/README.md`](../README.md) — index + conventions.
