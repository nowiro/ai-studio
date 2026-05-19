/**
 * Public API for the wizard-core library.
 *
 * Generic FormGroup accessors + status / tile primitives shared by every
 * wizard data lib (individual-wizard, business-wizard, …). Each wizard
 * keeps its own domain-specific `ROOT_PATHS`, models, validators, and
 * consent catalog in its own lib.
 *
 * @packageDocumentation
 */
export { asArray, asControl, asGroup, asOptionalGroup } from './form-helpers.js';
export type { WizardTileDescriptor } from './tile-descriptor.js';
export { computeWizardStatus } from './wizard-status.js';
export type { WizardStatus } from './wizard-status.js';
