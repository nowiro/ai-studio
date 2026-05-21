---
id: docs.projects.nowiro.business
title: Nowiro — business documentation
type: business
status: living
date: 2026-05-19
---

# Nowiro — business documentation

## Value proposition

Public-facing brand homepage for the `ai-studio` showcase. Acts as the elevator pitch (under 3 seconds) and the launcher for every demo app via federated routing or direct deep link.

## Personas

| ID    | Role           | Need                                       |
| ----- | -------------- | ------------------------------------------ |
| P-VIS | Site visitor   | "What is this and what can I do here"      |
| P-DEV | Evaluating dev | "Where is the GitHub repo / docs"          |
| P-SAL | Prospect       | "Show me a demo I can play with right now" |

## User journeys

### Journey 1 — Visitor reaches CTA

1. Lands on `/` → sees hero copy + 4 primary CTAs (open portal, browse demos, github, docs).
2. Clicks "Open portal" → navigates to `/portal` (or external if portal deployed separately).
3. Clicks "Browse demos" → reveals a grid of all demo apps with thumbnails + ports.

### Journey 2 — Developer follows the docs CTA

1. Visitor clicks "Docs" → opens `https://github.com/nowiro/ai-studio` README anchor.
2. Returns to nowiro home via back button without losing scroll state.

## KPIs

| Metric                             | Target        |
| ---------------------------------- | ------------- |
| Bundle size delta                  | < 120 KB gzip |
| LCP on slow 3G                     | < 2.5s        |
| CTA click-through (when GA4 wired) | > 15%         |
| A11y axe-core violations           | 0             |

## Roadmap

See (historic, see git log) — landing refresh + GA4 + analytics gate.
