import type { Grade, GradeValue } from '../models/index.js';

/** Result of computing per-subject averages: subject → average | null. */
export type SubjectAverageMap = ReadonlyMap<string, number | null>;

/** Weighted average per subject. Empty subjects map to `null`. */
export function subjectAverages(grades: readonly Grade[]): SubjectAverageMap {
  const sumByWeight = new Map<string, number>();
  const sumByValue = new Map<string, number>();
  for (const grade of grades) {
    sumByWeight.set(grade.subjectId, (sumByWeight.get(grade.subjectId) ?? 0) + grade.weight);
    sumByValue.set(grade.subjectId, (sumByValue.get(grade.subjectId) ?? 0) + grade.value * grade.weight);
  }
  const out = new Map<string, number | null>();
  for (const [subjectId, weight] of sumByWeight) {
    if (weight === 0) {
      out.set(subjectId, null);
      continue;
    }
    out.set(subjectId, (sumByValue.get(subjectId) ?? 0) / weight);
  }
  return out;
}

/** Round an average to one decimal place; `null` stays `null`. */
export function formatAverage(average: number | null): string {
  if (average === null) {
    return '—';
  }
  return average.toFixed(2);
}

/** True for a passing average (≥ 2.0 per Polish school standard). */
export function isPassing(average: number | null): boolean {
  return average !== null && average >= 2.0;
}

/** Coerce an arbitrary numeric input into a valid `GradeValue` (1..6). */
export function clampGradeValue(value: number): GradeValue {
  const rounded = Math.round(value);
  if (rounded <= 1) {
    return 1;
  }
  if (rounded >= 6) {
    return 6;
  }
  return rounded as GradeValue;
}
