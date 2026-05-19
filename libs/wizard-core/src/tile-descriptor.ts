/**
 * Generic tile descriptor — shared shape for every wizard's dashboard tiles.
 *
 * Each wizard defines its own concrete step-index union (`WizardStepIndex` =
 * `1 | 2 | 3 | 4 | 5` for the individual wizard, `1 | 2 | 3 | 4 | 5 | 6` for
 * business). The descriptor is parameterised by that union so the consumer
 * doesn't widen back to `number`.
 *
 * `path` is the dotted FormGroup path used by `computeWizardStatus()`;
 * `null` is the summary tile that maps to the whole form's validity.
 *
 * @packageDocumentation
 */
export interface WizardTileDescriptor<TStepIndex extends number> {
  /** 1-indexed step number — matches the URL segment in `/wizard/:step`. */
  readonly step: TStepIndex;
  /** Dotted form path for the tile's sub-form, or `null` for the summary tile. */
  readonly path: string | null;
  /** Material icon name (kebab-case allowed, e.g. `'task_alt'`). */
  readonly icon: string;
  /** Tile heading. */
  readonly title: string;
  /** One-line description below the heading. */
  readonly subtitle: string;
}
