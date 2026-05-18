---
id: docs.tools-shop.business
title: Tools-shop — business documentation
type: business
status: living
date: 2026-05-18
audience: [product, analyst, sales, stakeholder]
links:
  hub: README.md
---

# Tools-shop — business documentation

> The "what and why" view for the tools shop demo.

## Value proposition

A demo of an e-commerce front-end for **trade-specific products** — power
tools, hand tools, measuring devices, safety gear. Tests whether the
shared `shop-core` + `shop-ui` libs handle a domain with quantitative
attributes (voltage, weight, warranty months) cleanly.

- **Same checkout, cart, drawer as every other shop.**
- **Domain-specific facets**: category × tool type × power source.
- **Spec table on detail page** mirrors what a hardware retailer would
  show: voltage, weight, warranty, SKU code.
- **Mixed brands**: Bosch, Makita, DeWalt, Milwaukee, Stihl, Wera, Bahco,
  Stanley, 3M, Mitutoyo, Stabila, Festool, Uvex, Wkret-Met.

## Personas

| ID       | Role                | Primary need                                      |
| -------- | ------------------- | ------------------------------------------------- |
| P-PRO    | Tradesperson        | Find pro-grade tools with voltage + weight specs. |
| P-DIY    | Home DIY enthusiast | Browse by category; price-sensitive.              |
| P-DEV    | Frontend developer  | Reference for hosting a numeric-attribute domain. |
| P-TESTER | Test engineer / QA  | Author E2E from the demo script.                  |

## User journeys

### Journey 1 — DIY user finds a cordless drill

1. **Browse** — visits `/`; 29 tools in the grid.
2. **Filter category** — clicks **Elektronarzędzia** → narrows to power
   tools.
3. **Filter type** — clicks **Wiertarki** → 3 results.
4. **Filter power source** — clicks **Akumulatorowe**.
5. **Sort** — **Cena: rosnąco**.
6. **Open detail** — Bosch cordless drill with 2 batteries, 18V, 1.4 kg,
   24-month warranty.
7. **Add to cart** → checkout → done.

### Journey 2 — Pro buys 5 packs of safety glasses

1. Searches `3M`; results narrow to 3M products.
2. Opens 3M SecureFit glasses (1.90 zł × 5 pcs).
3. Adds to cart with quantity 5 via cart-page stepper.
4. Cart total recalculates instantly (`shop-core`'s `cartTotal`).

## Feature inventory

| Feature                                                 | Notes                                         |
| ------------------------------------------------------- | --------------------------------------------- |
| Catalogue with 29 tools (9 tool types, 4 power sources) | `libs/tools-shop-data/src/seed/catalogue.ts`  |
| Category / tool-type / power-source facets              | Tools-specific `ToolFilters` on `BaseFilters` |
| Search (name / brand / tags)                            | `shop-core`'s `matchesQuery`                  |
| Sort: popularity / price / rating / name                | `shop-core`'s `sortProducts`                  |
| Generic product card with subline                       | `<ais-shop-product-card>`                     |
| Tool detail page                                        | Voltage / weight / warranty / SKU chips       |
| Cart + drawer + checkout                                | All from `shop-ui`                            |
| localStorage cart persistence                           | `ais.tools-shop.cart.v1`                      |
| Playwright smoke E2E                                    | `apps/tools-shop-e2e/src/smoke.spec.ts`       |

## Non-goals

- Real backend / inventory.
- B2B pricing tiers.
- Configurator (e.g. choose blade + tool combos).
- After-sales service / RMA flow.

## Demo script

| Step | Action                                              | Expected outcome                           |
| ---- | --------------------------------------------------- | ------------------------------------------ |
| 1    | Open `<http://localhost:4209>`                      | 29 cards; facet panel on the left.         |
| 2    | Click **Elektronarzędzia** category.                | Power tools only.                          |
| 3    | Click **Akumulatorowe** in power source.            | Battery-powered tools only.                |
| 4    | Click any card → detail page.                       | Voltage / weight / warranty chips visible. |
| 5    | Click **Dodaj do koszyka** → cart icon → "Do kasy". | Stepper visible.                           |
| 6    | Complete 4 steps + place order.                     | Confirmation with order number.            |

## Roadmap

- Configurator (drill + bit + battery combos).
- After-sales: warranty registration flow.
- B2B account tier with negotiated prices.
- Tool comparison side-by-side.

## Glossary

| Term             | Meaning                                                   |
| ---------------- | --------------------------------------------------------- |
| **Tool**         | Domain product extending `BaseProduct`.                   |
| **Tool type**    | Functional class (drill / saw / grinder / sander / etc.). |
| **Power source** | `manual \| corded \| battery \| pneumatic`.               |
| **SKU code**     | Tool-shop internal identifier (`TS-TOOL-001`).            |
| **Voltage**      | Operating voltage in V; `null` for manual tools.          |
