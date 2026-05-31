---
id: docs.portal.testing
title: Portal — testing view
type: project
status: done
date: 2026-05-29
links:
  hub: README.md
  adr: ../../adr/0009-native-federation-microfrontends.md
---

# Portal — testing view

## Test strategy

The portal is a **Native Federation shell** (ADR-0009 / ADR-0012): a launcher that
loads each domain app as a lazily-fetched Web Component (`dist/apps/<slug>-element`).
It owns almost no domain logic, so its coverage model differs from a feature app:

- **No dedicated `portal-e2e` project.** A full portal e2e would have to build every
  remote element first (`pnpm nx run-many -t build-element`) and serve them — heavy
  and redundant with each app's own suite.
- **Remotes are tested in isolation.** Each loadable app (`dashboard`, `bookstore`,
  shops, `library`, `school-journal`, wizards, games, `union-vault`, `nowiro`) has its
  own `*-e2e` suite that exercises it directly. The portal only needs to prove the
  **shell** works: nav renders, the launcher grid lists every app, and a card opens a
  remote without a console error.

## What to verify (manual / smoke)

| Check                    | How                                                                 |
| ------------------------ | ------------------------------------------------------------------- |
| Shell renders            | `pnpm start:portal` → toolbar + sidenav + launcher grid visible     |
| Launcher lists every app | one card per registered remote, each with an **Otwórz** link        |
| A remote mounts          | click a card → the Web Component bootstraps in the content outlet   |
| No theme regression      | shell uses `--mat-sys-*`; cards/toolbar themed (not black-on-black) |

> Verified manually via Playwright/preview MCP on 2026-05-29: shell + launcher grid
> render correctly (purple M3 theme), no console errors.

## Suggested next coverage

- A thin `portal-e2e` smoke: build elements, serve portal, assert the launcher grid
  has N cards and one card click mounts a custom element (no console errors).
- Cross-MFE `BroadcastChannel` contract test (see `microfrontend-orchestration` skill).

## Run

```bash
pnpm start:portal-stack     # portal + dashboard in parallel
pnpm build:all-elements     # build every remote as a Web Component first
```
