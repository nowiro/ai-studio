---
id: rules.principles
title: Engineering principles — DRY, SOLID, KISS, YAGNI
type: rules
scope: global
priority: 1
version: 1.0.0
---

# Engineering principles

These are the **golden rules** every agent and contributor leans on when in doubt. They sit alongside [`core.md`](core.md) at the top of the priority chain. They don't replace specific stack rules (Angular, styling, testing, security) — they're the meta-rules those rules embody.

When two principles conflict, **clarity wins**. Write code humans want to maintain.

## 1. DRY — Don't Repeat Yourself

Each piece of knowledge has a single, authoritative representation.

- Same intent appearing in three or more places → extract.
- **But**: don't deduplicate code that _looks_ similar but represents _different_ concerns. Three identical-looking lines of unrelated logic are not a duplication; abstracting them couples futures that should stay independent.
- Heuristic: deduplicate **knowledge**, not **lines**. If both copies must change for the same reason, they were duplicated; if they change for different reasons, they're not.

| Good                                                           | Bad                                     |
| -------------------------------------------------------------- | --------------------------------------- |
| One Zod schema in `libs/util/schemas` reused by API + form     | Same schema duplicated in 3 components  |
| One `LoggerService` everyone injects                           | Five `console.log` wrappers across libs |
| One Tailwind token (`bg-primary`) sourcing Material design var | Hard-coded `#6750a4` in 12 components   |

## 2. KISS — Keep It Simple

Pick the simplest solution that solves the problem **as it exists today**. Cleverness that future-you can't read at a glance is a bug.

- Prefer plain functions over classes when no state is needed.
- Prefer signals over RxJS when no stream semantics are needed.
- Prefer Material's built-in components over hand-rolled.
- Prefer `@if` / `@for` over building a custom directive.
- Avoid metaprogramming (decorators-creating-decorators, dynamic class generation) unless there's a measured win.

If you find yourself writing comments to explain _what_ the code does, the code is not simple.

## 3. YAGNI — You Aren't Gonna Need It

Don't add capability the current task doesn't require.

- No "future-proof" abstractions. Add them when the second concrete use case lands.
- No config flags for behaviour nobody is asking for.
- No backwards-compatibility layers for code that hasn't been released.
- No dead code "just in case".

If a contributor argues "we might need X later" — they get to add X **later**, with a real spec.

## 4. SOLID

For object-oriented and signal-oriented code alike. Angular services, components and directives are the typical "objects" here.

### S — Single Responsibility

A class / component / function has **one reason to change**.

- A component that fetches data **and** renders **and** dispatches analytics has three reasons. Split.
- A service that handles auth **and** caching **and** logging has three reasons. Split.

### O — Open / Closed

Code is open for extension, closed for modification.

- Add new behaviour by passing a strategy / signal / function, not by editing a switch statement that grows linearly.
- Use signal-driven configuration (`provideXxx({ adapter })`) over inheritance.

### L — Liskov Substitution

If `B extends A`, `B` must work everywhere `A` works without surprising callers.

- Don't override a method to throw, return `null`, or change its contract.
- Prefer composition; inherit only when the "is-a" relation truly holds.

### I — Interface Segregation

Many narrow interfaces beat one wide one.

- A consumer that only needs `read()` shouldn't depend on a type that also exposes `write()` and `delete()`.
- Use Angular's `inject(MY_TOKEN)` with a small interface token, not the full service class.

### D — Dependency Inversion

Depend on abstractions, not on concretions — but only where substitution is actually useful.

- High-level features depend on a `BillingPort` interface; low-level adapters implement it.
- This is **not** a license to wrap every service in an interface "for testability". TestBed already handles substitution.

## 5. Composition over inheritance

Inheritance creates rigid hierarchies. Composition creates Lego.

- In Angular: prefer multiple small standalone components composed in a template over one big component with subclasses.
- In services: prefer injecting collaborators over inheriting behaviour.
- Mixins and abstract classes are last resorts.

## 6. High cohesion, low coupling

Things that change together live together. Things that change independently stay separate.

- A feature library has the route container + smart components + feature-local services. They change together.
- A UI library has dumb presentational components. They don't know about features.
- Coupling between libraries is enforced by `@nx/enforce-module-boundaries` (see [`nx.md`](nx.md)).

## 7. Boy Scout Rule

Leave the code a little better than you found it — but **scoped to the task**.

- Bug-fix PR: rename a confusingly-named local variable. ✅
- Bug-fix PR: refactor a 200-line service. ❌ (open a separate tech-debt issue).

This rule is about **small, opportunistic** improvements, not unsolicited rewrites.

## 8. Principle of Least Astonishment

Code should do what its name suggests, no more, no less.

- A function called `getInvoices()` does not also send analytics events.
- A signal called `total()` does not return a formatted string.
- A component selector `ais-button` does not render a `<div>`.

If you must surprise the reader, the comment is required.

## 9. Fail fast, fail loud

Errors at the boundary, not deep in the code.

- Validate every external payload at the HTTP boundary (Zod). Reject early.
- Don't silently coerce `null` into defaults — surface the missing input.
- AI model output: schema-bound (Zod) — never parse free text into business decisions.

## 10. Convention over configuration

Pick a convention, document it once, follow it everywhere.

- File names: `kebab-case` (Angular convention).
- Selectors: `ais-*`.
- Module boundaries: enforced by Nx tags.
- Commits: Conventional Commits.

When a new contributor (human or AI) asks "where should X go?", the answer should already be in `.ai/` or `docs/programming/`.

## 11. Reversibility — small, safe steps

Big changes are scary. Many small changes are routine.

- One concern per PR. Reviewer-able in one sitting.
- Generators (Nx, Angular CLI, Material schematics) over hand-edits.
- Feature flags / `@defer` blocks for risky launches.
- ADRs for decisions that are hard to reverse.

## 12. Code is read more than written

Optimise for the next reader, not the current writer.

- Names over comments.
- Explicit types over inferred ones at API boundaries.
- One sentence per markdown line for clean diffs.
- Examples in agent role files and prompts so new tools onboard fast.

## How agents apply these

Every agent loads this file at the start of its task. When two competing approaches both satisfy the immediate spec, the agent picks the one closer to these principles and notes the trade-off in its hand-off block. A code reviewer who spots a violation cites the **principle id** (e.g. _SRP_, _KISS_) — not vague "this seems wrong".

## What these are NOT

- **Not a checklist.** A PR doesn't need to demonstrate every principle.
- **Not commandments.** Real code sometimes violates a principle for a measured reason. Document the reason.
- **Not a substitute for spec rules.** Angular conventions, security rules and Nx boundaries are still binding.

## See also

- [`core.md`](core.md) — non-negotiable cross-cutting rules.
- [`angular.md`](angular.md), [`styling.md`](styling.md), [`testing.md`](testing.md), [`nx.md`](nx.md), [`security.md`](security.md) — stack-specific.
- [`docs/programming/coding-standards.md`](../../docs/programming/coding-standards.md) — concrete recipes.
