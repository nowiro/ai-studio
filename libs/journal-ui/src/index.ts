/**
 * Public API for the school-journal UI lib. Role-allow + role-guard + the
 * generic role-badge chip live in `@ai-studio/shared-app-shell`. This lib
 * just maps the journal's `JournalRole` enum to badge tones/labels so app
 * code stays terse.
 *
 * @packageDocumentation
 */
export { AttendanceChipComponent } from './attendance-chip.component.js';
export { GradeChipComponent } from './grade-chip.component.js';
export { JOURNAL_ROLE_LABELS, JOURNAL_ROLE_TONES } from './role-presentation.js';
