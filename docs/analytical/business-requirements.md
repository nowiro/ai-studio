# Business requirements

> The "why we exist" doc. Owned by the Analyst. Update via PR when goals shift.

## Vision

AI Studio is a workspace for building Angular applications with AI agents pair-programming alongside the team. It aims to:

1. Make AI-driven changes safe by default (multi-agent gating, lint, type, test, security).
2. Eliminate stale conventions across IDEs by keeping the rule set in `.ai/`.
3. Shorten the loop from idea → spec → ADR → PR → release.

## Strategic goals (next 6 months)

| Goal                                               | Metric                              | Target |
| -------------------------------------------------- | ----------------------------------- | ------ |
| Cut "first feature lands" time for new contributor | Days from clone to merged PR        | ≤ 2    |
| Keep AI-generated PRs stable                       | % AI PRs reverted within 14d        | ≤ 5 %  |
| Maintain code quality                              | Statement coverage on touched files | ≥ 80 % |
| Keep CI fast                                       | P95 CI duration on PR               | ≤ 10 m |
| Stay docs-current                                  | % public-API PRs with doc update    | 100 %  |

## Non-goals

- Becoming a multi-framework toolkit (Angular only for now).
- Replacing Genkit / Firebase AI Logic — we integrate with them.
- Hosting AI models ourselves.

## Stakeholders

- Engineering Lead (sponsor)
- Frontend & Backend engineers (primary users)
- QA / Test Engineer (quality gate)
- Product Analyst (specs)
- Security Engineer (audit)
- Tech Writer / Doc Owner

See [personas](personas.md) for usage patterns.

## Constraints

- All AI agents work against the same `.ai/` rule set across IDEs (Claude Code, Cursor, Copilot, …).
- Public APIs change only with an accepted ADR.
- Production deploys go through the release-manager workflow — no manual cuts.
