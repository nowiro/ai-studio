/**
 * Public API for the wizard-form-fill library.
 *
 * Wizard-agnostic dev-tools panel that walks a `FormGroup` and fills every
 * visible control via an injected `FormFillStrategy`. Per ADR-0011 §wrap
 * before consume — the walker is the seam; apps provide a Strategy.
 *
 * @packageDocumentation
 */
export { DevFabComponent } from './dev-fab.component.js';
export { FormFillerService } from './form-filler.service.js';
export {
  defaultByType,
  FORM_FILL_STRATEGY,
  resolveContext,
  type FillContext,
  type FillMode,
  type FormFillStrategy,
} from './form-fill-strategy.js';
export {
  generateValidKrs,
  generateValidNip,
  generateValidPesel,
  generateValidRegon,
  pick,
  pickInt,
  randomAdultBirthDate,
  randomCity,
  randomCompany,
  randomEmail,
  randomEmployedSince,
  randomFirstName,
  randomFlatNumber,
  randomFoundingYear,
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
  randomWebsiteUrl,
} from './polish-fake-data.js';
