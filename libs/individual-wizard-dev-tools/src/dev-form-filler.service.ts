/* eslint-disable @typescript-eslint/unbound-method --
 * `Validators.required` is passed as an unbound reference by design — Angular forms
 * documents this idiom. The rule cannot tell that `hasValidator` does identity comparison
 * rather than calling the method via the wrong `this`.
 */
/**
 * Fills the wizard's nested FormGroup with realistic Polish test data, respecting two rules:
 *
 *   1. **Only currently-visible controls** — conditional sub-groups that aren't in the tree
 *      yet are simply skipped. We run a multi-pass loop so that controls revealed *because*
 *      of a previous setValue (e.g. `educationLevel: 'phd'` adds `higherEducation`) get filled
 *      in a follow-up pass.
 *   2. **`required`-only mode** — when enabled, only controls carrying `Validators.required`
 *      are touched; the rest keep their default values. We detect required-ness by identity
 *      check against `Validators.required` (Angular guarantees this is a singleton).
 *
 * Disabled controls are always skipped (`AbstractControl.disabled === true`).
 */
import { inject, Injectable } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { asGroup, WizardFormFactory } from '@ai-studio/individual-wizard-data';

import {
  generateValidNip,
  generateValidPesel,
  pick,
  pickInt,
  randomAdultBirthDate,
  randomCity,
  randomCompany,
  randomEmail,
  randomEmployedSince,
  randomFirstName,
  randomFlatNumber,
  randomHouseNumber,
  randomKeyword,
  randomLastName,
  randomMonthlyGross,
  randomPhoneNumber,
  randomPosition,
  randomPostalCode,
  randomStreet,
  randomThesisTopic,
  randomUniversity,
} from './test-data.js';

type FillMode = 'required' | 'all';

interface Context {
  readonly leaf: string;
  readonly parent: string;
  readonly grandparent: string;
  readonly full: string;
  readonly indexInParent: number;
}

@Injectable({ providedIn: 'root' })
export class DevFormFillerService {
  private readonly factory = inject(WizardFormFactory);

  /** Fills every required (and currently visible) control. */
  fillRequired(form: FormGroup): void {
    this.run(form, 'required');
  }

  /** Fills every visible control regardless of validators. */
  fillAll(form: FormGroup): void {
    this.run(form, 'all');
  }

  /**
   * Forces the form into its deepest, most-branched shape (PhD → IT → security/data
   * → thesis, self-employed → contracts, multi-address, multi-language, multi-phone),
   * then delegates to `fillAll`. Used by the dev panel's "Maksymalne zagnieżdżenia"
   * action to demonstrate every conditional sub-tree at once.
   *
   * Triggers are set BEFORE the fill walk so the factory's `valueChanges` listeners
   * materialise the dependent sub-groups (higherEducation → specialisation → thesis,
   * employment.details, etc.) before the filler discovers them.
   */
  fillFullDemo(form: FormGroup): void {
    // 1) Seed list arrays so the multi-pass walk has extra rows to populate.
    this.factory.addAddress(form, 'mailing');
    this.factory.addPhone(form);
    this.factory.addLanguage(form);

    // 2) Force deepest-nest triggers. Each setValue cascades through the factory's
    //    valueChanges wiring synchronously, so by the time we reach step 3 the
    //    thesis sub-group is already in the tree.
    asGroup(form, 'survey').get('educationLevel')?.setValue('phd');
    asGroup(form, 'survey.higherEducation').get('field')?.setValue('IT');
    asGroup(form, 'survey.higherEducation.specialisation').get('branch')?.setValue('data');
    asGroup(form, 'survey.employment').get('status')?.setValue('self-employed');

    // 3) Add a couple of nested FormArray rows so the filler has more leaves to touch.
    this.factory.addKeyword(form);
    this.factory.addKeyword(form);
    this.factory.addContract(form);

    // 4) Normal fillAll cascades values into every visible leaf.
    this.run(form, 'all');
  }

  /**
   * Multi-pass fill — re-runs the traversal until no new controls appear. Controls revealed
   * by a previous setValue (e.g. `educationLevel: 'phd'` adds `higherEducation`) are filled in
   * the follow-up pass. Three passes is the maximum nesting we ever produce; cap at 6.
   */
  private run(form: FormGroup, mode: FillMode): void {
    const MAX_PASSES = 6;
    let previousSize = -1;
    for (let pass = 0; pass < MAX_PASSES; pass++) {
      this.fillNode(form, mode, []);
      const size = this.snapshotPaths(form).size;
      if (size === previousSize) break;
      previousSize = size;
    }
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

  private fillLeaf(control: FormControl, mode: FillMode, path: readonly string[]): void {
    if (mode === 'required' && !this.isRequired(control)) return;
    const value = this.generateValue(path, control);
    if (value !== undefined) control.setValue(value, { emitEvent: true });
  }

  private isRequired(control: FormControl): boolean {
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

  private generateValue(path: readonly string[], control: FormControl): unknown {
    const ctx = resolveContext(path);
    const strategy = FILL_STRATEGIES[ctx.leaf];
    if (strategy !== undefined) return strategy(ctx, control);
    return defaultByType(ctx, control);
  }
}

// ── Strategy table (extracted to avoid SonarJS max-switch-cases) ────────────

type Strategy = (ctx: Context, control: FormControl) => unknown;

const FILL_STRATEGIES: Partial<Record<string, Strategy>> = {
  firstName: () => randomFirstName('female'),
  // Optional middle name — fill anyway in `fillAll` mode (no Validators.required,
  // so `fillRequired` skips it automatically via the `isRequired()` guard).
  middleName: () => randomFirstName('female'),
  lastName: () => randomLastName(),
  pesel: () => generateValidPesel(randomAdultBirthDate(), 'female'),
  nip: () => generateValidNip(),
  email: () => randomEmail(),
  dateOfBirth: () => randomAdultBirthDate(),
  gender: () => 'female',
  citizenship: () => 'PL',
  streetType: () => 'ul.',
  street: () => randomStreet(),
  houseNumber: () => randomHouseNumber(),
  flatNumber: () => randomFlatNumber(),
  postalCode: () => randomPostalCode(),
  city: () => randomCity(),
  country: () => 'PL',
  // `purpose` lives at `contact.addresses.<i>.purpose` — the leaf is `purpose`, so
  // `indexInParent` is -1 (only set when the leaf path itself is an array index).
  // The actual array index is in `ctx.parent` (the path component above the leaf).
  // Using `indexInParent` here was a bug: every address ended up marked `mailing`,
  // and the cross-step validator fired "missing residence address".
  purpose: (ctx) => (arrayIndexFrom(ctx) === 0 ? 'residence' : 'mailing'),
  number: () => randomPhoneNumber(),
  type: (ctx) => resolveType(ctx),
  companyName: () => randomCompany(),
  position: () => randomPosition(),
  since: () => randomEmployedSince(),
  grossMonthly: () => randomMonthlyGross(),
  educationLevel: () => 'phd',
  university: () => randomUniversity(),
  field: () => 'IT',
  branch: () => pick(['data', 'security']),
  topic: () => randomThesisTopic(),
  code: (ctx) => resolveLanguageCode(ctx),
  level: (ctx) => resolveLevel(ctx),
  status: () => 'employed',
  acceptTerms: () => true,
  granted: () => true,
  // Consent bookkeeping fields are never overwritten:
  key: () => undefined,
  label: () => undefined,
  required: () => undefined,
};

// ── Helpers (file-local) ────────────────────────────────────────────────────

function resolveContext(path: readonly string[]): Context {
  const last = path[path.length - 1] ?? '';
  const isIndex = /^\d+$/.test(last);
  const indexInParent = isIndex ? Number(last) : -1;

  // When we're inside a FormArray, the leaf "name" is actually the parent's key
  // (e.g. `survey.languages.0.code` → leaf='code'; but `…keywords.0` → leaf='keywords').
  const leaf = isIndex ? (path[path.length - 2] ?? '') : last;
  const parent = isIndex ? (path[path.length - 3] ?? '') : (path[path.length - 2] ?? '');
  const grandparent = isIndex ? (path[path.length - 4] ?? '') : (path[path.length - 3] ?? '');

  return { leaf, parent, grandparent, full: path.join('.'), indexInParent };
}

function resolveType(ctx: Context): string {
  if (ctx.full.includes('.phones.')) return 'mobile';
  if (ctx.full.includes('.contracts.')) return 'uop';
  return 'mobile';
}

function resolveLanguageCode(ctx: Context): string {
  // Same caveat as the `purpose` strategy: the array index lives in `ctx.parent`,
  // not in `indexInParent` (which is -1 unless the leaf path is the index itself).
  if (ctx.full.includes('.languages.')) return arrayIndexFrom(ctx) === 0 ? 'en' : 'de';
  return 'en';
}

/**
 * Returns the FormArray index that owns this leaf, or -1 if the leaf is not
 * inside a FormArray entry. For path `contact.addresses.0.purpose`, the leaf is
 * `purpose` and `ctx.parent` is `'0'` — so we read the index from `parent`.
 */
function arrayIndexFrom(ctx: Context): number {
  const parsed = Number.parseInt(ctx.parent, 10);
  return Number.isNaN(parsed) ? -1 : parsed;
}

function resolveLevel(ctx: Context): string {
  if (ctx.full.includes('.languages.')) return pick(['B1', 'B2', 'C1']);
  return 'B2';
}

function defaultByType(ctx: Context, control: FormControl): unknown {
  if (ctx.leaf === 'keywords') return randomKeyword();
  const current: unknown = control.value;
  if (typeof current === 'string') return `${ctx.leaf || 'value'}-${pickInt(1, 999)}`;
  if (typeof current === 'number') return pickInt(1, 100);
  if (typeof current === 'boolean') return true;
  return undefined;
}
