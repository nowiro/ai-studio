import { describe, expect, it } from 'vitest';

import { applicableConsents } from './consents-catalog.js';
import type { ConsentContext } from './consents-catalog.js';
import type { SurveyValue } from './models.js';

const baseSurvey: SurveyValue = {
  educationLevel: 'secondary',
  employment: { status: 'unemployed' },
  languages: [],
};

const baseCtx: ConsentContext = {
  citizenship: 'PL',
  residenceCountry: 'PL',
  survey: baseSurvey,
};

describe('applicableConsents', () => {
  it('returns GDPR + extended PL + profiling for a PL respondent', () => {
    const keys = applicableConsents(baseCtx).map((c) => c.key);
    expect(keys).toContain('gdpr-base');
    expect(keys).toContain('gdpr-extended-pl');
    expect(keys).toContain('profiling');
    expect(keys).not.toContain('ccpa-base');
  });

  it('switches to CCPA when respondent is US-based', () => {
    const keys = applicableConsents({ ...baseCtx, citizenship: 'US', residenceCountry: 'US' }).map((c) => c.key);
    expect(keys).toContain('ccpa-base');
    expect(keys).not.toContain('gdpr-base');
    expect(keys).not.toContain('gdpr-extended-pl');
  });

  it('adds academic-records when education level is higher', () => {
    const survey: SurveyValue = { ...baseSurvey, educationLevel: 'higher' };
    const keys = applicableConsents({ ...baseCtx, survey }).map((c) => c.key);
    expect(keys).toContain('academic-records');
  });

  it('adds employer-verification when status is employed', () => {
    const survey: SurveyValue = {
      ...baseSurvey,
      employment: { status: 'employed' },
    };
    const keys = applicableConsents({ ...baseCtx, survey }).map((c) => c.key);
    expect(keys).toContain('employer-verification');
  });

  it('adds thesis-publication when a thesis is present', () => {
    const survey: SurveyValue = {
      ...baseSurvey,
      educationLevel: 'phd',
      higherEducation: {
        university: 'AGH',
        field: 'IT',
        specialisation: {
          branch: 'security',
          thesis: { topic: 'Side-channel attacks', keywords: ['timing'] },
        },
      },
    };
    const keys = applicableConsents({ ...baseCtx, survey }).map((c) => c.key);
    expect(keys).toContain('thesis-publication');
  });

  it('flags required consents (gdpr-base in EU)', () => {
    const required = applicableConsents(baseCtx)
      .filter((c) => c.required)
      .map((c) => c.key);
    expect(required).toEqual(['gdpr-base']);
  });
});
