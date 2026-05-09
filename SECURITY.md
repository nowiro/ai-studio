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

| Control                     | When                    | Tool                        |
| --------------------------- | ----------------------- | --------------------------- |
| Secret scanning (diff)      | Every PR                | Gitleaks                    |
| Secret scanning (full repo) | Push to main + weekly   | Gitleaks                    |
| Dependency audit (high+)    | Every CI run + every PR | `pnpm audit`                |
| CodeQL static analysis      | Push to main + weekly   | GitHub CodeQL               |
| Conventional Commits        | Every commit + every PR | commitlint + husky          |
| Token redaction in logs     | Runtime                 | `src/shared/log.ts` pattern |
| AI config parity            | Every CI run            | `validate-ai-config.mjs`    |
| Trinity baseline sync       | Every CI run            | `check-trinity.mjs`         |

## Responsible Disclosure

90-day coordinated disclosure timeline. After 90 days from initial report (or earlier with reporter agreement), vulnerability details may be published with full credit.

## Sensitive credentials — user-profile config

`ai-studio` does not store third-party credentials. The sibling MCP repos in the trinity (`ai-mcp-alm`, `ai-mcp-devtools`) read all secrets from a per-user file outside the repo:

| Platform    | Default path                                                               |
| ----------- | -------------------------------------------------------------------------- |
| **Windows** | `%USERPROFILE%\.config\nowiro\<repo>\config.json`                          |
| **macOS**   | `~/.config/nowiro/<repo>/config.json`                                      |
| **Linux**   | `$XDG_CONFIG_HOME/nowiro/<repo>/config.json` (defaults to `~/.config/...`) |

The path is computed by `os.homedir()` so it works without any Windows-specific code branch. Resolution priority is **env var → user-profile config → throw** — never a default secret. See the per-repo `SECURITY.md` for the schema.

If `ai-studio` adds a feature that needs a third-party token (Memory MCP cloud sync, telemetry, …), we mirror the same pattern: gitignored `config.json`, schema in `src/shared/user-config.ts`, repo-only `config.example.json` with placeholders.

The trinity rules are codified in [`.ai/rules/production-readiness.md`](.ai/rules/production-readiness.md) §1 (Permissions) and §2 (Audit logs) — both byte-identical across the three repos.

## Hardening references

- [`.ai/rules/security.md`](.ai/rules/security.md) — internal security rules every agent obeys.
- [`.ai/rules/production-readiness.md`](.ai/rules/production-readiness.md) — six operational must-haves.
- [`.ai/architecture.md`](.ai/architecture.md) — canonical architecture reference (3 primitives, 3 layers, MCP power stack).
- OWASP Top 10 + OWASP LLM Top 10.
- Angular security guide: <https://angular.dev/best-practices/security>.
