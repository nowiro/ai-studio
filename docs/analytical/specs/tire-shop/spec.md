---
id: spec.tire-shop
title: Tire-shop — tire-retail product catalogue + cart demo
type: spec
phase: 1-specify
status: accepted
date: 2026-05-18
author: analyst
links:
  plan: ../../../ai-workflow/plans/2026-05-18-tire-shop.md
  adr: ../../../adr/0006-tire-shop-state.md
---

# Tire-shop — specification

> Phase 1 (Specify) artefact. Tech choices live in the linked plan + ADR.

## Problem statement

The repo demonstrates AI-assisted Angular delivery across diverse domains:
a multi-page financial portal (`union-vault`), a stepper wizard
(`personal-data-wizard`), and two canvas games (`pong-game`, `tetris-game`).
It is missing a **canonical e-commerce shape**: faceted search, product
detail, cart, multi-step checkout.

The tire-shop demo fills that gap. Tire retail is a useful reference
domain because it exposes the hardest UX problem in any specialised
catalogue: **fitment** (width / profile / diameter / load / speed)
cross-cut with **brand**, **season**, **EU label** and **price**.
Solving the catalogue UX once gives every future e-commerce demo a template.

## Personas affected

| Persona id | Role                | Why they care                                                     |
| ---------- | ------------------- | ----------------------------------------------------------------- |
| P-SHOPPER  | Driver buying tires | Wants to find a fitting set fast; price + EU label matter.        |
| P-DEV      | Frontend developer  | Needs the reference for facet UIs + cart + multi-step checkout.   |
| P-TESTER   | Test engineer / QA  | Authors E2E from this spec; verifies acceptance criteria.         |
| P-ANALYST  | Product / Analyst   | Verifies AC traceability and metrics; reviews scope cuts.         |
| P-DEVOPS   | DevOps / SRE        | Wants the new app to fit the standard Nx build/serve/e2e cadence. |

## User stories

### US-1 — Find tires that fit my car

> **As** P-SHOPPER **I want** to enter my tire size (e.g. 205/55 R16) and
> filter by season **so that** I see only candidates that fit my wheels.

### US-2 — Compare on EU label + price

> **As** P-SHOPPER **I want** to sort the results by price and by EU label
> grade **so that** I can balance running cost against safety/efficiency.

### US-3 — Inspect a single tire

> **As** P-SHOPPER **I want** to open a product detail page with gallery,
> spec table, reviews and "fits my car" tab **so that** I am confident
> before I buy.

### US-4 — Add to cart and check out

> **As** P-SHOPPER **I want** to add tires to a cart, adjust quantities,
> and complete checkout in a 4-step Reactive Forms wizard **so that** I can
> finalise the purchase without registration.

### US-5 — Reference implementation for facets

> **As** P-DEV **I want** the catalogue to demonstrate signal-driven faceted
> search **so that** I can copy the structure when building any catalogue UI.

## Acceptance criteria

### AC-1 — Catalogue lists ≥ 50 SKUs

- **Given** the player navigates to `/`
- **When** the page finishes loading
- **Then** at least 50 product cards are rendered
- **And** the facet panel is visible on the left (desktop) or drawer (mobile)

### AC-2 — Brand filter narrows results

- **Given** the catalogue is loaded
- **When** the user toggles a brand checkbox
- **Then** only SKUs of that brand remain visible
- **And** the result count chip updates within 50 ms

### AC-3 — Size filter accepts width / profile / diameter

- **Given** the catalogue is loaded
- **When** the user enters `205 / 55 R 16`
- **Then** only SKUs matching that fitment are visible
- **And** unrelated sizes are excluded

### AC-4 — Sort by price asc / desc

- **Given** results are visible
- **When** the user selects "price: low → high"
- **Then** results are sorted by `priceCents` ascending
- **When** the user selects "price: high → low"
- **Then** results are sorted descending

### AC-5 — Sort by EU label score

- **Given** results are visible
- **When** the user selects "EU label score"
- **Then** results are sorted by composite label score (fuel + wet + noise) ascending

### AC-6 — Empty-state for 0 hits

- **Given** the user picks a filter combo with no matches
- **When** the catalogue re-renders
- **Then** an empty-state with `data-testid="catalogue-empty"` is visible
- **And** a "clear all filters" button restores the full set

### AC-7 — Product detail page

- **Given** a card is clicked
- **When** the detail page loads
- **Then** the gallery, spec table, EU label badge and price are visible
- **And** a "fits my car" tab shows fitment compatibility
- **And** a `data-testid="add-to-cart"` CTA is visible

### AC-8 — Cart persists across page reloads

- **Given** the user added 2 tires to the cart
- **When** the page is reloaded
- **Then** the cart still contains 2 tires
- **And** the count badge in the header reads `2`

### AC-9 — Quantity adjust + remove in cart

- **Given** the cart drawer is open
- **When** the user clicks the `+` button on a line
- **Then** the line quantity increments and the total recalculates
- **When** the user clicks "Remove"
- **Then** the line is deleted

### AC-10 — 4-step checkout, validated jointly

- **Given** the cart has ≥ 1 line
- **When** the user clicks "Checkout"
- **Then** a 4-step Reactive-Forms wizard renders (contact → delivery → invoice → summary)
- **And** "Next" is disabled until the current step is valid
- **And** the summary step shows all collected data + cart total

### AC-11 — Tests gate the build

- **Given** the developer runs `pnpm nx test tire-data --coverage`
- **Then** statement / line / function coverage is ≥ 80 %
- **And** branch coverage is ≥ 75 %

### AC-12 — Playwright happy path

- **Given** the developer runs `pnpm nx e2e tire-shop-e2e`
- **Then** the test "filter → add → checkout → summary" passes in chromium

## Success metrics

| Metric                  | Target                                                                      |
| ----------------------- | --------------------------------------------------------------------------- |
| Filter response time    | < 50 ms on a mid-range laptop for any combo of facets                       |
| Catalogue dataset size  | 50–100 SKUs covering ≥ 8 brands, ≥ 3 seasons, ≥ 20 unique sizes             |
| Bundle size delta       | < 350 KB gzip added by `apps/tire-shop` + `libs/tire-*` over baseline shell |
| Unit-test coverage      | ≥ 80 % statements / ≥ 75 % branches on `libs/tire-data`                     |
| E2E acceptance coverage | AC-1 … AC-12 each map to at least one Playwright assertion                  |

## Non-goals

- Real backend / inventory API.
- Real payments (Stripe / PayU / Przelewy24).
- User accounts / login (guest checkout only).
- Server-side rendering / Angular Universal.
- Internationalisation pipeline (Polish strings inline; English code).
- Email confirmations.
- Admin panel / inventory management.
- Mobile-app wrapper / PWA install banner v1.
- A/B test framework.

## Open questions

(All resolved during /clarify; left here as audit trail.)

- ✅ Cart persistence layer? — **localStorage** (frontend-only demo).
- ✅ State management? — **Pure signals + services** (see ADR-0006).
- ✅ Currency? — **PLN only.** Symbol `zł`, locale `pl-PL`.
- ✅ Image source? — **CDN placeholders** (`https://picsum.photos`) for v1.
- ✅ Reviews? — **Mocked**, 0–10 reviews per SKU; 5-star rating.

## Traceability

- **Plan:** [`../../../ai-workflow/plans/2026-05-18-tire-shop.md`](../../../ai-workflow/plans/2026-05-18-tire-shop.md)
- **ADR (state):** [`../../../adr/0006-tire-shop-state.md`](../../../adr/0006-tire-shop-state.md)
