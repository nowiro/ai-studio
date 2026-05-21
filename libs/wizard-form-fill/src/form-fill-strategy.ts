/**
 * Form-fill strategy contract — the seam between the generic walker and the
 * wizard-specific knowledge.
 *
 * Why a Strategy + DI token (instead of subclassing or factory injection):
 *   - The walker in `form-filler.service.ts` knows NOTHING about your form's
 *     shape — it just traverses controls and asks the Strategy "what's the
 *     value for this field?" and "what should I expand for max-nest mode?".
 *   - Each app provides its own implementation via DI, keeping wizards
 *     decoupled (no cross-import between `individual-wizard-data` and
 *     `business-wizard-data`).
 *
 * Pattern matches ADR-0011 / ADR-0016 (wrap before consume): one seam in the
 * library, swappable implementations per consumer.
 */
import { InjectionToken } from '@angular/core';
import type { AbstractControl, FormControl, FormGroup } from '@angular/forms';

/** Filling modes the FAB exposes — preserved from individual-wizard original. */
export type FillMode = 'required' | 'all';

/**
 * Context the walker passes to the Strategy for each leaf control.
 *
 * Note: when the leaf lives inside a FormArray entry, the array index is in
 * `parent` (the path component above the leaf), not in `indexInParent` (which
 * is -1 unless the leaf path itself is the index). The convenience getter
 * `arrayIndex` exposes the resolved index.
 */
export interface FillContext {
  /** Last segment of the path — typically the control name. */
  readonly leaf: string;
  /** One segment above the leaf — useful for distinguishing siblings. */
  readonly parent: string;
  /** Two segments above — sometimes needed to disambiguate. */
  readonly grandparent: string;
  /** Full dotted path from the root, e.g. `survey.languages.0.code`. */
  readonly full: string;
  /** -1 unless the leaf path itself is an array index. */
  readonly indexInParent: number;
  /** Resolved array index that owns this leaf (-1 if not in an array). */
  readonly arrayIndex: number;
}

/**
 * Wizard-specific behaviour the generic walker depends on.
 *
 * Implementations:
 *   - `IndividualFormFillStrategy` in `libs/individual-wizard-data`
 *   - `BusinessFormFillStrategy` in `libs/business-wizard-data`
 */
export interface FormFillStrategy {
  /**
   * Expand the form BEFORE filling — typically adds extra array rows
   * (additional phones, addresses, contracts, representatives) and triggers
   * cascading sub-trees by setting key control values. Called only by
   * `fillFullDemo()` (the "Maksymalne zagnieżdżenia" action).
   */
  expandForMaxNesting(form: FormGroup): void;

  /**
   * Generate a value for the given leaf control. Return `undefined` to skip
   * (the walker falls back to a type-based default — string / number / bool).
   *
   * Implementations typically maintain a strategy table keyed by `ctx.leaf`.
   */
  resolveFieldValue(ctx: FillContext, control: FormControl<unknown>): unknown;

  /**
   * Optional final-pass hook — runs after the multi-pass walk, before
   * `markAllAsTouched()`. Use for cross-field cleanup (e.g. clearing fields
   * that conditional logic should have made invisible).
   */
  finalize?(form: FormGroup, mode: FillMode): void;
}

/**
 * DI token consumed by `FormFillerService`. Apps provide an implementation
 * in their `app.config.ts`:
 *
 * ```ts
 * { provide: FORM_FILL_STRATEGY, useClass: IndividualFormFillStrategy }
 * ```
 */
export const FORM_FILL_STRATEGY = new InjectionToken<FormFillStrategy>('FORM_FILL_STRATEGY');

/**
 * Builds a `FillContext` from a control path. Pure helper — exported so
 * Strategy implementations can derive the same context shape if they need
 * to invoke fall-back logic.
 */
export function resolveContext(path: readonly string[]): FillContext {
  const last = path[path.length - 1] ?? '';
  const isIndex = /^\d+$/.test(last);
  const indexInParent = isIndex ? Number(last) : -1;

  // When we're inside a FormArray, the leaf "name" is actually the parent's key
  // (e.g. `survey.languages.0.code` → leaf='code'; but `…keywords.0` → leaf='keywords').
  const leaf = isIndex ? (path[path.length - 2] ?? '') : last;
  const parent = isIndex ? (path[path.length - 3] ?? '') : (path[path.length - 2] ?? '');
  const grandparent = isIndex ? (path[path.length - 4] ?? '') : (path[path.length - 3] ?? '');

  const parsedParent = Number.parseInt(parent, 10);
  const arrayIndex = Number.isNaN(parsedParent) ? -1 : parsedParent;

  return { leaf, parent, grandparent, full: path.join('.'), indexInParent, arrayIndex };
}

/* eslint-disable sonarjs/pseudo-random --
 * `defaultByType` is a *fake data* fallback for the dev-fill panel — no
 * security boundary, no cryptographic guarantee needed. Same rationale as
 * `polish-fake-data.ts`. */

/**
 * Type-based fallback when the Strategy returns `undefined` AND the control
 * already has a value of known primitive type. Used by the walker; exported
 * so Strategies can also call it from their `resolveFieldValue`.
 */
export function defaultByType(ctx: FillContext, control: AbstractControl): unknown {
  const current: unknown = control.value;
  if (typeof current === 'string') return `${ctx.leaf || 'value'}-${Math.floor(Math.random() * 999) + 1}`;
  if (typeof current === 'number') return Math.floor(Math.random() * 100) + 1;
  if (typeof current === 'boolean') return true;
  return undefined;
}
