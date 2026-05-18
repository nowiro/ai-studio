/**
 * Public API for the wizard validators library.
 *
 * @packageDocumentation
 */
export { ageInYears, isAdult } from './age.js';
export { isValidNip, normaliseNip } from './nip.js';
export { isValidPeselChecksum, parsePesel } from './pesel.js';
export type { PeselInfo } from './pesel.js';
export { isValidPlPhone } from './phone.js';
export { autoFormatPostalCode, isValidPlPostalCode } from './postal-code.js';
export {
  ERROR_NIP,
  ERROR_PESEL,
  ERROR_PESEL_BIRTHDATE_MISMATCH,
  ERROR_PHONE,
  ERROR_POSTAL,
  ERROR_UNDERAGE,
  adultAgeValidator,
  nipValidator,
  peselMatchesDateOfBirthValidator,
  peselValidator,
  plPhoneValidator,
  plPostalCodeValidator,
} from './angular-validators.js';
