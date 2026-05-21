/* eslint-disable sonarjs/pseudo-random --
 * Math.random() is intentional here: this module produces *fake* test data for
 * the dev-fill panel. No security boundary, no cryptographic guarantee needed.
 */
/**
 * Polish-flavoured fake-data generators for the dev-fill panel.
 *
 * Pure functions — no Angular DI, no async, no side effects beyond
 * `Math.random()`. Both `IndividualFormFillStrategy` (in
 * `libs/individual-wizard-data`) and `BusinessFormFillStrategy` (in
 * `libs/business-wizard-data`) import from here so the data corpus stays
 * shared. Polish-specific (PESEL, NIP, REGON, KRS) — if a non-PL wizard
 * appears later, mirror this module under a different locale name.
 */

const FIRST_NAMES_F = ['Anna', 'Maria', 'Katarzyna', 'Magdalena', 'Agnieszka', 'Joanna', 'Małgorzata'];
const FIRST_NAMES_M = ['Piotr', 'Tomasz', 'Krzysztof', 'Michał', 'Andrzej', 'Marcin', 'Jakub'];
const LAST_NAMES = [
  'Kowalska',
  'Nowak',
  'Wiśniewska',
  'Wójcik',
  'Kowalczyk',
  'Kamiński',
  'Lewandowski',
  'Zieliński',
  'Szymański',
  'Woźniak',
];
const CITIES = [
  'Warszawa',
  'Kraków',
  'Łódź',
  'Wrocław',
  'Poznań',
  'Gdańsk',
  'Szczecin',
  'Bydgoszcz',
  'Lublin',
  'Katowice',
];
const STREETS = [
  'Marszałkowska',
  'Nowy Świat',
  'Krakowskie Przedmieście',
  'Mokotowska',
  'Floriańska',
  'Długa',
  'Świętokrzyska',
  'Piotrkowska',
  'Grunwaldzka',
  'Niepodległości',
];
const COMPANIES = [
  'Allegro Sp. z o.o.',
  'CD Projekt RED',
  'Asseco Poland',
  'PKN Orlen',
  'Comarch',
  'Atende',
  'Netguru',
  'Brainhub',
];
const POSITIONS = [
  'Senior Frontend Developer',
  'Product Manager',
  'Tech Lead',
  'QA Engineer',
  'UX Designer',
  'DevOps Engineer',
  'Engineering Manager',
];
const UNIVERSITIES = [
  'Politechnika Warszawska',
  'AGH Akademia Górniczo-Hutnicza',
  'Uniwersytet Jagielloński',
  'Politechnika Wrocławska',
  'Uniwersytet Warszawski',
  'Politechnika Gdańska',
];
const THESIS_TOPICS = [
  'Wykrywanie anomalii w ruchu sieciowym z użyciem uczenia maszynowego',
  'Ataki side-channel na nowoczesne procesory x86',
  'Federacyjne uczenie głębokie z gwarancjami prywatności różnicowej',
];
const THESIS_KEYWORDS = [
  'anomaly-detection',
  'side-channel',
  'timing-attack',
  'federated-learning',
  'differential-privacy',
];

export function pick<T>(arr: readonly T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  const value = arr[index];
  if (value === undefined) {
    throw new Error('pick(): cannot draw from an empty array.');
  }
  return value;
}

export function pickInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFirstName(gender?: 'female' | 'male'): string {
  if (gender === 'male') return pick(FIRST_NAMES_M);
  if (gender === 'female') return pick(FIRST_NAMES_F);
  return pick(Math.random() < 0.5 ? FIRST_NAMES_F : FIRST_NAMES_M);
}

export function randomLastName(): string {
  return pick(LAST_NAMES);
}

export function randomCity(): string {
  return pick(CITIES);
}

export function randomStreet(): string {
  return pick(STREETS);
}

export function randomCompany(): string {
  return pick(COMPANIES);
}

export function randomPosition(): string {
  return pick(POSITIONS);
}

export function randomUniversity(): string {
  return pick(UNIVERSITIES);
}

export function randomThesisTopic(): string {
  return pick(THESIS_TOPICS);
}

export function randomKeyword(): string {
  return pick(THESIS_KEYWORDS);
}

export function randomPostalCode(): string {
  return `${String(pickInt(0, 99)).padStart(2, '0')}-${String(pickInt(0, 999)).padStart(3, '0')}`;
}

export function randomEmail(): string {
  const localBase = pick(['anna', 'piotr', 'maria', 'tomek', 'kasia', 'jan']);
  return `${localBase}.test${pickInt(1, 9999)}@example.com`;
}

export function randomPhoneNumber(): string {
  const a = String(pickInt(500, 799));
  const b = String(pickInt(100, 999));
  const c = String(pickInt(100, 999));
  return `+48 ${a} ${b} ${c}`;
}

export function randomHouseNumber(): string {
  return String(pickInt(1, 250));
}

export function randomFlatNumber(): string {
  return String(pickInt(1, 80));
}

export function randomAdultBirthDate(): Date {
  // 22–60 years old, deterministic UTC date so tests stay stable across timezones.
  const now = new Date();
  const age = pickInt(22, 60);
  const month = pickInt(0, 11);
  const day = pickInt(1, 28);
  return new Date(Date.UTC(now.getUTCFullYear() - age, month, day));
}

export function randomEmployedSince(): Date {
  const now = new Date();
  const yearsAgo = pickInt(1, 10);
  return new Date(Date.UTC(now.getUTCFullYear() - yearsAgo, pickInt(0, 11), pickInt(1, 28)));
}

export function randomMonthlyGross(): number {
  return pickInt(5_000, 30_000);
}

export function randomFoundingYear(): number {
  const now = new Date();
  return now.getUTCFullYear() - pickInt(2, 35);
}

export function randomWebsiteUrl(): string {
  const slug = pick(['company', 'corp', 'group', 'tech', 'studio']);
  return `https://${slug}-${pickInt(100, 9999)}.example.com`;
}

// ── Polish identifiers — checksum-correct ────────────────────────────────────

const PESEL_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
const NIP_WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7];
// REGON 9-digit checksum weights (per GUS spec).
const REGON_WEIGHTS_9 = [8, 9, 2, 3, 4, 5, 6, 7];

/** Builds a valid PESEL for a given birth date and gender. */
export function generateValidPesel(birth: Date = randomAdultBirthDate(), gender: 'female' | 'male' = 'female'): string {
  const year = birth.getUTCFullYear();
  const month = birth.getUTCMonth() + 1;
  const day = birth.getUTCDate();

  let mmEncoded: number;
  if (year >= 1800 && year < 1900) mmEncoded = month + 80;
  else if (year >= 1900 && year < 2000) mmEncoded = month;
  else if (year >= 2000 && year < 2100) mmEncoded = month + 20;
  else if (year >= 2100 && year < 2200) mmEncoded = month + 40;
  else mmEncoded = month + 60; // 2200–2299

  const yy = String(year % 100).padStart(2, '0');
  const mm = String(mmEncoded).padStart(2, '0');
  const dd = String(day).padStart(2, '0');

  // Serial: 3 random digits + gender digit (even=female, odd=male).
  const serialBase = pickInt(0, 999);
  let genderDigit = pickInt(0, 9);
  if (gender === 'female' && genderDigit % 2 !== 0) genderDigit = (genderDigit + 1) % 10;
  if (gender === 'male' && genderDigit % 2 === 0) genderDigit = (genderDigit + 1) % 10;
  const serial = `${String(serialBase).padStart(3, '0')}${genderDigit}`;

  const body = `${yy}${mm}${dd}${serial}`;
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(body[i]) * (PESEL_WEIGHTS[i] ?? 0);
  const check = (10 - (sum % 10)) % 10;
  return `${body}${check}`;
}

/** Builds a valid NIP — 10 digits with checksum, never the 10-remainder pattern. */
export function generateValidNip(): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    const digits: number[] = [];
    for (let i = 0; i < 9; i++) digits.push(pickInt(0, 9));
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += (digits[i] ?? 0) * (NIP_WEIGHTS[i] ?? 0);
    const check = sum % 11;
    if (check === 10) continue;
    return `${digits.join('')}${check}`;
  }
  // Fallback: deterministic known-good NIP.
  return '5270103391';
}

/**
 * Builds a valid 9-digit REGON. Used by business-wizard. Algorithm per GUS:
 * weights [8,9,2,3,4,5,6,7] applied to first 8 digits, modulo 11, with 10
 * remainder retried (rare).
 */
export function generateValidRegon(): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    const digits: number[] = [];
    for (let i = 0; i < 8; i++) digits.push(pickInt(0, 9));
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += (digits[i] ?? 0) * (REGON_WEIGHTS_9[i] ?? 0);
    const check = sum % 11;
    if (check === 10) continue;
    return `${digits.join('')}${check}`;
  }
  // Fallback: deterministic known-good REGON.
  return '012345674';
}

/**
 * Builds a syntactically valid KRS — 10 digits, leading zeros allowed.
 * KRS has no checksum in the public spec — we just generate a 10-digit
 * numeric string. Business-wizard's `krsValidator()` accepts this shape.
 */
export function generateValidKrs(): string {
  let s = '';
  for (let i = 0; i < 10; i++) s += String(pickInt(0, 9));
  return s;
}
