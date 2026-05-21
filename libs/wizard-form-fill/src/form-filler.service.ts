/* eslint-disable @typescript-eslint/unbound-method --
 * `Validators.required` is passed as an unbound reference by design — Angular forms
 * documents this idiom. The rule cannot tell that `hasValidator` does identity comparison
 * rather than calling the method via the wrong `this`.
 */
/**
 * Generic form-filler — multi-pass walker that fills a nested `FormGroup`
 * with values supplied by an injected `FormFillStrategy`.
 *
 * Two invariants (preserved from the original individual-wizard implementation):
 *
 *   1. **Only currently-visible controls.** Conditional sub-groups that aren't
 *      in the tree yet are skipped. The multi-pass loop re-runs the traversal
 *      so that controls revealed by a previous `setValue` (e.g.
 *      `educationLevel: 'phd'` adds `higherEducation`) are filled in a
 *      follow-up pass. Capped at 6 passes (deepest known nest is 3).
 *
 *   2. **`required`-only mode** — when enabled, only controls carrying
 *      `Validators.required` are touched; the rest keep their default values.
 *      Detected by identity check against `Validators.required` (Angular
 *      guarantees this is a singleton).
 *
 * Disabled controls are always skipped (`AbstractControl.disabled === true`).
 *
 * Strategy-driven: every leaf value comes from the injected `FormFillStrategy`
 * via `FORM_FILL_STRATEGY` DI token. The walker knows nothing about specific
 * wizards — each app provides its own Strategy.
 */
import { inject, Injectable } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import {
  defaultByType,
  type FillContext,
  type FillMode,
  FORM_FILL_STRATEGY,
  type FormFillStrategy,
  resolveContext,
} from './form-fill-strategy.js';

const MAX_PASSES = 6;

@Injectable({ providedIn: 'root' })
export class FormFillerService {
  private readonly strategy = inject<FormFillStrategy>(FORM_FILL_STRATEGY);

  /** Fills every required (and currently visible) control. */
  fillRequired(form: FormGroup): void {
    this.run(form, 'required');
  }

  /** Fills every visible control regardless of validators. */
  fillAll(form: FormGroup): void {
    this.run(form, 'all');
  }

  /**
   * Triggers the Strategy's `expandForMaxNesting()` hook (adds extra rows,
   * forces deepest-nest triggers) then runs `fillAll`. Used by the dev
   * panel's "Maksymalne zagnieżdżenia" action.
   */
  fillFullDemo(form: FormGroup): void {
    this.strategy.expandForMaxNesting(form);
    this.run(form, 'all');
  }

  /**
   * Multi-pass fill — re-runs the traversal until no new controls appear.
   * Controls revealed by a previous setValue are filled in the follow-up pass.
   */
  private run(form: FormGroup, mode: FillMode): void {
    let previousSize = -1;
    for (let pass = 0; pass < MAX_PASSES; pass++) {
      this.fillNode(form, mode, []);
      const size = this.snapshotPaths(form).size;
      if (size === previousSize) break;
      previousSize = size;
    }
    this.strategy.finalize?.(form, mode);
    form.markAllAsTouched();
    form.updateValueAndValidity();
  }

  private fillNode(node: AbstractControl, mode: FillMode, path: readonly string[]): void {
    if (node.disabled) return;
    if (node instanceof FormGroup) {
      this.fillGroup(node, mode, path);
    } else if (node instanceof FormArray) {
      this.fillArray(node, mode, path);
    } else if (node instanceof FormControl) {
      this.fillLeaf(node, mode, path);
    }
  }

  private fillGroup(group: FormGroup, mode: FillMode, path: readonly string[]): void {
    for (const key of Object.keys(group.controls)) {
      const child = group.get(key);
      if (child !== null) this.fillNode(child, mode, [...path, key]);
    }
  }

  private fillArray(array: FormArray, mode: FillMode, path: readonly string[]): void {
    for (let i = 0; i < array.length; i++) {
      const child = array.at(i);
      this.fillNode(child, mode, [...path, String(i)]);
    }
  }

  private fillLeaf(control: FormControl<unknown>, mode: FillMode, path: readonly string[]): void {
    if (mode === 'required' && !this.isRequired(control)) return;
    const ctx: FillContext = resolveContext(path);
    const strategyValue = this.strategy.resolveFieldValue(ctx, control);
    const value = strategyValue === undefined ? defaultByType(ctx, control) : strategyValue;
    if (value !== undefined) control.setValue(value, { emitEvent: true });
  }

  private isRequired(control: FormControl<unknown>): boolean {
    return control.hasValidator(Validators.required);
  }

  /** Snapshots every leaf-control path so we can detect newly-added conditional sub-trees. */
  private snapshotPaths(form: FormGroup): Set<string> {
    const set = new Set<string>();
    const walk = (node: AbstractControl, path: string[]): void => {
      if (node instanceof FormGroup) {
        for (const key of Object.keys(node.controls)) {
          const child = node.get(key);
          if (child !== null) walk(child, [...path, key]);
        }
      } else if (node instanceof FormArray) {
        for (let i = 0; i < node.length; i++) walk(node.at(i), [...path, String(i)]);
      } else {
        set.add(path.join('.'));
      }
    };
    walk(form, []);
    return set;
  }
}
