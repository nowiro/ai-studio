import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TokenCardComponent, TypographyRowComponent } from '@ai-studio/starter-ui';
import { AisHeroComponent, AisSectionComponent } from '@ai-studio/ui-kit';

interface ColorRole {
  readonly name: string;
  readonly role: 'primary' | 'secondary' | 'tertiary' | 'error' | 'surface' | 'surface-variant';
}

interface TypeScale {
  readonly scale: string;
  readonly sample?: string;
}

/**
 * `starter.home` — single-page showcase of the Angular 21 + M3 + Tailwind v4
 * design-token bridge.
 *
 * Three sections:
 *   1. **Color tokens** — six M3 container roles rendered with their CSS-var
 *      names, demonstrating how `--mat-sys-<role>-container` flows through
 *      both Angular Material components and Tailwind utilities.
 *   2. **Typography scale** — every M3 type role rendered with a Polish
 *      pangram sample, sourced via `var(--mat-sys-<scale>)`.
 *   3. **Tailwind ↔ M3** — the same tokens accessed through Tailwind utility
 *      classes (`bg-primary`, `text-on-surface`, `bg-tertiary-container`).
 */
@Component({
  selector: 'ais-starter-home',
  imports: [AisHeroComponent, AisSectionComponent, TokenCardComponent, TypographyRowComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly colorRoles: readonly ColorRole[] = [
    { name: 'Primary', role: 'primary' },
    { name: 'Secondary', role: 'secondary' },
    { name: 'Tertiary', role: 'tertiary' },
    { name: 'Error', role: 'error' },
    { name: 'Surface', role: 'surface' },
    { name: 'Surface variant', role: 'surface-variant' },
  ];

  protected readonly typeScales: readonly TypeScale[] = [
    { scale: 'display-large' },
    { scale: 'display-medium' },
    { scale: 'display-small' },
    { scale: 'headline-large' },
    { scale: 'headline-medium' },
    { scale: 'title-large' },
    { scale: 'title-medium' },
    { scale: 'body-large' },
    { scale: 'body-medium' },
    { scale: 'label-medium' },
  ];

  protected readonly tailwindExamples: readonly { readonly classes: string; readonly label: string }[] = [
    { classes: 'bg-primary text-on-primary', label: 'Primary surface' },
    { classes: 'bg-primary-container text-on-primary-container', label: 'Primary container' },
    { classes: 'bg-secondary-container text-on-secondary-container', label: 'Secondary container' },
    { classes: 'bg-tertiary-container text-on-tertiary-container', label: 'Tertiary container' },
    { classes: 'bg-surface text-on-surface border border-outline-variant', label: 'Surface · bordered' },
    { classes: 'bg-error-container text-on-error-container', label: 'Error container' },
  ];
}
