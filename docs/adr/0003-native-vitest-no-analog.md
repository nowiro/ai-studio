# 0003 — Native Vitest in Angular 21; drop `@analogjs/vitest-angular`

- Status: accepted
- Date: 2026-05-07
- Decision-makers: maintainers
- Consulted: test-engineer agent owners
- Informed: all contributors

## Context and problem statement

When the starter was first sketched against Angular 19, `@analogjs/vitest-angular` was the practical way to run Vitest with `TestBed`, signals and zoneless components. Angular 20 introduced `@angular/build:unit-test` (then experimental). Angular 21 stabilised it.

Question: do we still need Analog?

## Decision drivers

- Minimise dependencies that overlap with the framework's first-party tooling.
- Keep test config close to what `nx g @nx/angular:app` emits today.
- Avoid pulling Analog's meta-framework runtime when we don't use Analog as a meta-framework.

## Considered options

1. **Keep `@analogjs/vitest-angular`** as the test bridge.
2. **Use Angular 21's native `@angular/build:unit-test --runner=vitest`** and remove Analog from the starter.
3. Drop Vitest in favour of Karma / Jasmine.

## Decision outcome

Chosen **option 2**.

Angular 21's native unit-test builder runs Vitest under the hood, configures jsdom, and supports `TestBed`, signals, standalone and zoneless components without extra glue. Analog remains a fine choice when a project adopts it as a *meta-framework* (file-based routing, server endpoints à la SvelteKit) — that's an orthogonal decision, not a test-runner decision.

### Consequences

- ➕ One fewer non-framework dep at the test layer.
- ➕ Test configuration matches what new contributors see in Angular's docs.
- ➖ Folks coming from Analog-based projects need to adjust setup expectations (small; mostly removing imports).
- ➖ When/if Analog (the meta-framework) is adopted later, we re-add `@analogjs/platform`, but the unit-test config does not change.

## Pros and cons of the options

### Option 1 — Keep Analog as test bridge

- ➕ Familiar to contributors used to Analog.
- ➖ Duplicates what the framework now ships; one more migration target on each Angular major.

### Option 2 — Native Vitest

- ➕ First-party. Fewer moving parts.
- ➕ Aligns with `@nx/angular:app` defaults in Nx 21.
- ➖ Requires Angular 21+ (we already require it).

### Option 3 — Karma / Jasmine

- ➕ Long-standing in Angular.
- ➖ Slow watch loop. Karma is end-of-life in Angular's roadmap.

## Implementation plan

- [x] Drop `@analogjs/*` from `package.json`.
- [x] Remove `vitest.config.base.ts` and `vitest.workspace.ts` (Angular's builder configures Vitest per-project).
- [x] Update `.ai/rules/testing.md`, `docs/programming/testing-strategy.md`, `.ai/context/tech-stack.md`, `docs/technical/tech-stack.md`, `docs/architecture/dependencies.md`, `README.md`, `CLAUDE.md`, `AGENTS.md`.
- [x] Update `nx.json` generator defaults so `unitTestRunner: "vitest"` produces native targets.

## References

- Angular `@angular/build:unit-test` documentation.
- [`.ai/rules/testing.md`](../../.ai/rules/testing.md)
