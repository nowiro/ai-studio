/**
 * Re-export of Transloco's `t` pipe under our own selector chain.
 *
 * Why re-export: apps import `TPipe` from `@ai-studio/shared-i18n` rather than
 * `TranslocoPipe` from `@jsverse/transloco`. Swapping the i18n vendor later
 * becomes a one-file change inside this lib.
 *
 * Usage in standalone components:
 *
 * ```ts
 * @Component({
 *   imports: [TPipe],
 *   template: `<h1>{{ 'home.welcome' | t }}</h1>`,
 * })
 * export class HomeComponent {}
 * ```
 */
export { TranslocoPipe as TranslatePipe } from '@jsverse/transloco';
