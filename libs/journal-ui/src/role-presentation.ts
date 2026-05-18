import type { JournalRole } from '@ai-studio/journal-data';
import type { BadgeTone } from '@ai-studio/shared-app-shell';

/** Tone for the shared `<ais-role-badge>` per journal role. */
export const JOURNAL_ROLE_TONES: Readonly<Record<JournalRole, BadgeTone>> = {
  student: 'blue',
  parent: 'violet',
  teacher: 'emerald',
  admin: 'amber',
};

/** Polish display label per journal role. */
export const JOURNAL_ROLE_LABELS: Readonly<Record<JournalRole, string>> = {
  student: 'Uczeń',
  parent: 'Rodzic',
  teacher: 'Nauczyciel',
  admin: 'Sekretariat',
};
