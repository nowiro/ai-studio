# 0011 — UI-kit wrapper strategy

- Status: accepted (2026-05-19, after /clarify)
- Date: 2026-05-18
- Decision-makers: orchestrator, architect
- Consulted: frontend-developer, code-reviewer
- Informed: every app maintainer

## Context and problem statement

The 11 apps import Angular Material directly in feature components,
`*-ui` libs and app shells (`MatButton`, `MatCard`, `MatFormField`,
`MatInput`, `MatChip`, `MatStepper`, `MatTable`, …). If a future product
decision retires Material in favour of Spartan, Headless UI, PrimeNG or
a hand-rolled set, every consumer becomes a diff.

How do we centralise the Material consumption so a swap is a localised
change?

## Decision drivers

- **One seam** — exactly one place in the repo imports
  `@angular/material/*`.
- **Stable API** — `<ais-button variant="filled">` stays the same
  regardless of what's under the hood.
- **Zero visual regression** — at swap-time, the wrapper renders the
  same DOM; only the underlying component swaps.
- **OnPush + signals** — every wrapper follows the repo's
  `prefer-signals`, `prefer-on-push-component-change-detection` rules.
- **ESLint enforcement** — direct `@angular/material/*` imports outside
  `libs/ui-kit` are a compile-time error after Phase 2.

## Considered options

1. **Thin wrappers** — `<ais-button>` is a component that templates a
   `<button matButton>`. The API is repo-stable; the visuals stay
   Material.
2. **Headless wrappers** — `<ais-button>` exposes behaviour only (no
   styles). Material classes are applied at the template level. Lowest
   ceremony but harder to swap visuals without touching every app.
3. **Adapter pattern** — `<ais-button>` resolves the underlying
   component via DI (`UiKitConfig`). One token, multiple implementations.
4. **Do nothing** — keep direct Material imports. Accept the swap-cost
   if it ever happens.

## Decision outcome

Chosen option **1 — thin wrappers**.

A `libs/ui-kit` library exposes one Angular component per Material
primitive, with a stable input/output contract. Each wrapper renders
the Material primitive underneath:

```html
<!-- libs/ui-kit/src/buttons/button.component.ts template -->
<button
  [color]="color()"
  [disabled]="disabled()"
  [type]="type()"
  matButton
>
  <ng-content></ng-content>
</button>
```

```ts
@Component({
  selector: 'ais-button',
  imports: [MatButtonModule],
  template: ...,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant = input<'text' | 'filled' | 'outlined' | 'tonal'>('filled');
  color = input<'primary' | 'accent' | 'warn'>('primary');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
}
```

The swap is then a single-lib diff: replace the `<button matButton>`
templates with `<button [class.btn]="…">` (or whatever the next lib
demands) and the rest of the repo is untouched.

### Consequences

- ➕ One source of truth for what's wrapped + what isn't.
- ➕ ESLint `no-restricted-imports` blocks future direct Material
  imports.
- ➕ Each wrapper has its own spec file — the wrapped contract is
  unit-tested independently of the apps.
- ➖ Adds one component layer per primitive. Marginal indirection cost.
- ➖ The wrapper's API is a versioning surface — breaking changes need
  a SemVer major.

## Pros and cons of the options

### Option 1 — Thin wrappers (chosen)

- ➕ Stable repo-wide API.
- ➕ Swap is a single-lib diff.
- ➖ ~17 new components to write + maintain.

### Option 2 — Headless wrappers

- ➕ Smallest footprint per wrapper.
- ➖ Doesn't solve the swap problem — Material classes still live in
  every consumer.

### Option 3 — Adapter pattern via DI

- ➕ Multiple impls behind one token.
- ➖ Premature: we have no second impl planned. YAGNI.

### Option 4 — Do nothing

- ➕ Zero work now.
- ➖ Swap-cost stays high. Defeats the stated goal.

## API conventions

Every wrapper follows the same rules:

- **Selector** — `ais-<name>` (kebab-case), per repo prefix.
- **OnPush** — `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Signals** — inputs via `input()`, outputs via `output()`. No
  `@Input()` decorators.
- **Content projection** — pass children via `<ng-content>` whenever
  possible.
- **A11y** — forward ARIA attributes via host bindings.
- **No leaking implementation** — the wrapper's public surface MUST
  NOT mention `mat*` class names or types. Consumers see only
  `<ais-…>` + its inputs.

## Component inventory

The first 8 (Phase 2.2) cover ~80 % of repo consumption:

`<ais-button>`, `<ais-icon-button>`, `<ais-card>`, `<ais-form-field>`,
`<ais-input>` directive, `<ais-select>`, `<ais-chip>`, `<ais-divider>`.

The remaining ~9 (Phase 2.6): `<ais-tabs>`, `<ais-stepper>`,
`<ais-table>`, `<ais-paginator>`, `<ais-expansion-panel>`,
`<ais-tooltip>` directive, `<ais-badge>` directive, `<ais-toolbar>`,
`<ais-sidenav>`, `<ais-radio-group>`, `<ais-checkbox>`,
`<ais-button-toggle-group>`.

## Implementation plan

PR-sized bullets, mirroring Phase 2 of the consolidated roadmap.

- [ ] Scaffold `libs/ui-kit` (`scope:shared`, `type:ui`).
- [ ] Wrap the first 8 components with unit tests ≥ 80 %.
- [ ] Migrate `libs/shop-ui` + `libs/library-ui` + `libs/journal-ui` to
      use the wrappers.
- [ ] Migrate the remaining apps' inline Material consumers.
- [ ] Enable `no-restricted-imports` for `@angular/material/*` outside
      `libs/ui-kit` (Phase 2.5).
- [ ] Wrap the remaining ~9 components.

## References

- plan: docs/ai-workflow/plans/2026-05-18-portal-elements-keycloak.md
- rules: .ai/rules/angular.md, .ai/rules/styling.md
- upstream: <https://material.angular.io>
- inspiration: <https://github.com/spartan-ng/ui>
