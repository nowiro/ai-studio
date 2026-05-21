/**
 * Public API for the ui-kit library — cross-app presentation primitives.
 *
 * Per ADR-0011 § wrap before consume: this is the **one seam** for
 * shared layout components. Apps consume `<ais-section>` / `<ais-hero>` /
 * `<ais-feature-card>` / `<ais-stat-tile>` / `<ais-cta-button>` instead of
 * re-implementing the same shape per app.
 *
 * Adding a new primitive? Verify the pattern repeats ≥ 3× across apps
 * first (per `.ai/rules/styling.md §11`). One-off layouts stay in apps.
 *
 * @packageDocumentation
 */
export { AisCtaButtonComponent, type CtaVariant } from './lib/cta-button.component.js';
export { AisFeatureCardComponent } from './lib/feature-card.component.js';
export { AisHeroComponent, type HeroTheme } from './lib/hero.component.js';
export { AisSectionComponent, type SectionTone } from './lib/section.component.js';
export { AisStatTileComponent } from './lib/stat-tile.component.js';
