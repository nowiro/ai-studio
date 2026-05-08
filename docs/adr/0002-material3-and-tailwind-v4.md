# 0002 — Angular Material 3 paired with Tailwind CSS v4

- Status: accepted
- Date: 2026-05-07
- Decision-makers: maintainers
- Consulted: AI working group, frontend leads
- Informed: all contributors

## Context and problem statement

We need a UI primitive layer for AI Studio. Two camps usually fight here:

- "Components only" (Material / PrimeNG / shadcn-style) — fastest path to a polished UX, but layout/spacing customisation is verbose.
- "Utilities only" (Tailwind / UnoCSS) — fast layout, but every interactive widget (dialog, snackbar, table) needs to be hand-rolled or pulled from a separate kit.

We want both speed-of-shipping and visual coherence with Material design, on Angular 21.

## Decision drivers

- Fast iteration on layout / spacing / responsive behaviour.
- A11y-correct interactive widgets without re-implementing them.
- Single design-token source so utilities and components agree on theme.
- Fits the multi-agent workflow (predictable code an agent can generate).

## Considered options

1. **Material only** — `@angular/material` 21 with custom SCSS for layout.
2. **Tailwind only** — components hand-rolled or via a headless kit (CDK + Spartan-NG style).
3. **Material 3 + Tailwind v4 paired** (this decision).

## Decision outcome

Chosen **option 3**.

Rationale: Material 3 in v21 ships theme tokens as **CSS custom properties** (`--mat-sys-*`). Tailwind v4 is **CSS-first** and reads tokens via `@theme` from a CSS file. We bridge the two in `styles/tailwind.css` so every Tailwind utility colour resolves to a Material design token. Components stay Material; layout / spacing stays Tailwind; theming changes once.

### Consequences

- ➕ One token source. Dark mode and density toggles work for both surfaces.
- ➕ Agents generate predictable HTML — Material component + Tailwind utility on the host.
- ➕ Bundle size stays sane (Tailwind v4 emits only used utilities; Material is standalone-import).
- ➖ Two ESLint plugins (`angular-eslint`, `tailwindcss`) and one extra Prettier plugin — small overhead.
- ➖ Slight learning curve for contributors who only know one of the two.

## Pros and cons of the options

### Option 1 — Material only

- ➕ Zero CSS framework to learn.
- ➕ Strong a11y baseline.
- ➖ Layout / spacing requires bespoke SCSS per component (slow).
- ➖ Hard to express responsive layouts without a utility layer.

### Option 2 — Tailwind only

- ➕ Layout is fast.
- ➖ Re-implementing dialog / snackbar / form-field is months of work.
- ➖ A11y regressions easy to introduce in hand-rolled widgets.

### Option 3 — Material 3 + Tailwind v4 paired

- ➕ Best of both; clear division of responsibilities.
- ➕ Tokens unified via CSS variables.
- ➖ Need a styling rule file to keep boundaries clean (we have one: [`.ai/rules/styling.md`](../../.ai/rules/styling.md)).

## Implementation plan

- [x] Pin `@angular/material@^21` and `@angular/cdk@^21` in `package.json`.
- [x] Pin `tailwindcss@^4` and `@tailwindcss/postcss@^4`.
- [x] Add `postcss.config.mjs` with the Tailwind PostCSS plugin.
- [x] Create `styles/tailwind.css` with `@theme` mapping Material design tokens.
- [x] Add `.ai/rules/styling.md`.
- [x] Add `eslint-plugin-tailwindcss` + `prettier-plugin-tailwindcss`.
- [x] Update Frontend Developer agent example.
- [ ] Apply the pattern in the first generated app once `nx g @nx/angular:app` runs.

## References

- [`.ai/rules/styling.md`](../../.ai/rules/styling.md)
- [Angular Material 3](https://material.angular.dev)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- upstream: <https://angular.dev/ai>
