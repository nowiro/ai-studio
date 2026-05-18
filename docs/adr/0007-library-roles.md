---
id: adr.0007
title: Library role-based routing — guard + directive + signal-driven AuthService
status: accepted
date: 2026-05-18
deciders: [architect, frontend-developer]
supersedes: null
superseded-by: null
links:
  plan: ../ai-workflow/plans/2026-05-18-library-app.md
  spec: ../analytical/specs/library-app/spec.md
---

# ADR-0007 — Library role-based routing

## Context

The library demo distinguishes two personas: `reader` and `librarian`.
A mock-login dropdown swaps the active profile; the chosen role drives
both the menu and the routes that can be reached.

Three approaches were considered:

1. **Component-level branching** (`@if (role() === 'librarian')`) — minimal
   plumbing but routes themselves remain reachable directly.
2. **Functional `CanActivate` route guard** — Angular 21 idiom, isolated.
3. **Structural directive** (`*aisRoleAllow="['librarian']"`) — hides UI;
   does not block navigation.

## Decision

**Use both:** a functional `CanMatch` guard at the route layer to block
direct navigation, AND a structural `*aisRoleAllow` directive at the UI
layer to hide menu items / buttons that the current role cannot use.

The single source of truth is `AuthService.currentMember` — a writable
signal updated by the mock-login dropdown. The guard reads
`auth.currentMember()` synchronously (signals make this clean); the
directive is `aisRoleAllow="['librarian']"`.

## Rationale

- **Defence in depth.** Guards stop bookmarked / typed URLs; directives
  keep the UI from showing actions the user cannot use.
- **Synchronous signals.** Angular 21's `CanMatchFn` can be a plain
  function calling `inject(AuthService).currentMember()` directly —
  no observable plumbing.
- **No new dep.** Same `scope:shared` + `scope:library` boundary as the
  other libs; no NgRx, no OAuth.

## Consequences

### Positive

- Two layers of enforcement; hard to forget either.
- Test surface is small: 1 signal, 1 guard fn, 1 directive.
- Mock-login mirrors the actual auth shape; replacing with real OAuth
  later is a single service swap.

### Negative

- Two enforcement points means two places to update when adding a new role.
- The guard cannot know the chosen role until `AuthService` finishes
  re-hydrating from localStorage on app boot — we accept a brief
  redirect-to-account flash if the URL is bookmarked.

## Compliance

- `AuthService.currentMember = signal<Member | null>(...)`.
- `libRoleGuard: CanMatchFn = () => inject(AuthService).currentMember()?.role === 'librarian'`.
- `*aisRoleAllow="['librarian']"` — structural directive in `library-ui`.
- Reader-only routes use no guard; the directive merely hides the
  librarian-only menu items.

## Links

- Spec: [`../analytical/specs/library-app/spec.md`](../analytical/specs/library-app/spec.md)
- Plan: [`../ai-workflow/plans/2026-05-18-library-app.md`](../ai-workflow/plans/2026-05-18-library-app.md)
