# Security policy

## Reporting a vulnerability

**Do not open a public GitHub issue.** Use [GitHub's private security advisories](../../security/advisories/new) instead.

We aim to:

- Acknowledge within 2 business days.
- Provide an initial severity assessment within 5 business days.
- Patch and disclose responsibly.

## Scope

In scope:

- Code in `apps/`, `libs/`, `tools/`.
- CI/CD pipelines under `.github/workflows/`.
- AI rule files and agent configurations under `.ai/` and `.claude/` (e.g. unsafe defaults that could leak secrets).

Out of scope:

- Vulnerabilities in third-party dependencies (please report upstream; we'll consume the patch).
- Findings against branches that aren't `main` or a release tag.
- Social engineering against contributors.

## What to include

- Affected version / commit SHA.
- Repro steps.
- Impact assessment.
- Proposed remediation if you have one.

## Coordination

We follow [coordinated vulnerability disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure). After a fix lands, we publish a security advisory crediting the reporter (unless they prefer anonymity).

## Hardening references

- [`.ai/rules/security.md`](.ai/rules/security.md) — internal security rules every agent obeys.
- OWASP Top 10 + OWASP LLM Top 10.
- Angular security guide: <https://angular.dev/best-practices/security>.
