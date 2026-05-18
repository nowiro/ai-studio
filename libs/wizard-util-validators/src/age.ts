/**
 * Age helpers — operate on calendar dates in UTC to avoid TZ drift.
 */

export function ageInYears(birth: Date, today: Date = new Date()): number {
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const monthDelta = today.getUTCMonth() - birth.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getUTCDate() < birth.getUTCDate())) {
    age--;
  }
  return age;
}

export function isAdult(birth: Date, today: Date = new Date()): boolean {
  return ageInYears(birth, today) >= 18;
}
