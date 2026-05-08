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

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.x     | ✅        |

## SDLC Security Controls

The following controls run automatically on every commit and PR:

| Control                      | When                          | Tool                        |
| ---------------------------- | ----------------------------- | --------------------------- |
| Secret scanning (diff)       | Every PR                      | Gitleaks                    |
| Secret scanning (full repo)  | Push to main + weekly         | Gitleaks                    |
| Dependency audit (high+)     | Every CI run + every PR       | `pnpm audit`                |
| CodeQL static analysis       | Push to main + weekly         | GitHub CodeQL               |
| Conventional Commits         | Every commit + every PR       | commitlint + husky           |
| Token redaction in logs      | Runtime                       | `src/shared/log.ts` pattern  |
| AI config parity             | Every CI run                  | `validate-ai-config.mjs`    |
| Trinity baseline sync        | Every CI run                  | `check-trinity.mjs`         |

## Responsible Disclosure

90-day coordinated disclosure timeline. After 90 days from initial report (or earlier with reporter agreement), vulnerability details may be published with full credit.

## Hardening references

- [`.ai/rules/security.md`](.ai/rules/security.md) — internal security rules every agent obeys.
- OWASP Top 10 + OWASP LLM Top 10.
- Angular security guide: <https://angular.dev/best-practices/security>.
