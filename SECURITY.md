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

## Angular security checklist (v21+)

Reference: <https://angular.dev/best-practices/security>. Applied across all four apps (`nowiro`, `union-vault`, `pong-game`, `individual-wizard`).

| #   | Requirement                               | Status | Notes                                                                                                                                                                                               |
| --- | ----------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Latest Angular                            | ✅     | v21.0.0                                                                                                                                                                                             |
| 2   | No customized Angular core                | ✅     | Stock distribution only                                                                                                                                                                             |
| 3   | No APIs marked "Security Risk"            | ✅     | Audit clean                                                                                                                                                                                         |
| 4-9 | XSS / interpolation / no DOM mutation     | ✅     | Templates use `{{ }}`; no `eval`/`Function`/`document.write`                                                                                                                                        |
| 7   | AOT in production                         | ✅     | `@angular/build:application` default                                                                                                                                                                |
| 10  | `bypassSecurityTrust*` audited            | ✅     | Zero uses anywhere in `apps/` or `libs/`                                                                                                                                                            |
| 11  | Content Security Policy                   | ✅     | Per-app `<meta http-equiv="Content-Security-Policy">` in each `apps/*/src/index.html`; tighten via HTTP header in prod                                                                              |
| 12  | Unique CSP nonces per request             | ⏳     | Server-side concern — add at deploy                                                                                                                                                                 |
| 13  | Trusted Types                             | ⏳     | Add `require-trusted-types-for 'script'` directive to deploy-time CSP header                                                                                                                        |
| 14  | XSRF/CSRF protection                      | ✅     | `provideHttpClient(withFetch())` in `union-vault` (cross-origin GETs only — XSRF tokens auto-suppressed). Switch to `withXsrfConfiguration()` when same-origin backend with mutating requests lands |
| 15  | Non-standard XSRF cookie/header names     | N/A    | No same-origin backend yet                                                                                                                                                                          |
| 16  | Validate Host headers (`allowedHosts`)    | ⏳     | Configure at deploy (Cloudflare Pages / Netlify rules)                                                                                                                                              |
| 17  | Trust proxy headers cautiously            | ⏳     | Deploy-time toggle                                                                                                                                                                                  |
| 18  | Strip XSSI prefixes                       | ✅     | `HttpClient` auto-removes `)]}',\n`                                                                                                                                                                 |
| 19  | Never serve Angular templates from server | ✅     | Static SPA — no server-side templating                                                                                                                                                              |
| 20  | Audit security-sensitive APIs             | ✅     | grep clean: no `bypassSecurityTrust*`, no `[innerHTML]` with user input                                                                                                                             |
| 21  | `strictTemplates: true`                   | ✅     | All four apps' `tsconfig.json` enable Angular strict template type-checking                                                                                                                         |
| 22  | No dynamic template generation            | ✅     | No `compileTemplate` / dynamic component compilation                                                                                                                                                |
| 23  | Disable XSRF only when necessary          | N/A    | Default XSRF stays enabled                                                                                                                                                                          |
| 24  | Server-side validation                    | N/A    | No backend in any app                                                                                                                                                                               |

### Known-safe `[innerHTML]` usage

`apps/nowiro/src/app/components/about/about.component.html` binds `[innerHTML]` to `t().about.p1/p2/p3`. The content is static i18n owned by the repo (`<strong>` accents only), and Angular's `DomSanitizer` runs on every `[innerHTML]` binding (SecurityContext.HTML) — no exploit surface.

### Per-app CSP summary

| App                 | External resources whitelisted in CSP                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `nowiro`            | + Google Fonts (Material Icons CSS + woff2). Flagi PL/GB serwowane lokalnie z `assets/flags/` — żadnego flag CDN. |
| `pong-game`         | `'self'` only + `blob:` images (Phaser canvas)                                                                    |
| `individual-wizard` | + `fonts.googleapis.com` (CSS), `fonts.gstatic.com` (woff2)                                                       |
| `union-vault`       | + Google Fonts, `cdn.jsdelivr.net` (flag-icons), `api.frankfurter.dev`, `www.floatrates.com`                      |

`'unsafe-inline'` for `script-src`/`style-src` is required because Angular emits an inline boot script and Material/Tailwind inject inline styles. Production deploys should swap meta CSP for an HTTP header with per-request nonces (§11-12).

### Why `frame-ancestors` lives at the HTTP layer

Every app's `<meta http-equiv="Content-Security-Policy">` **intentionally** omits `frame-ancestors`. The CSP spec requires that directive to come from an HTTP response header — browsers ignore it (and `report-uri` / `sandbox`) when delivered via `<meta>` and emit a console warning. Set it on the production host (Cloudflare Pages / Netlify / nginx) with:

```
Content-Security-Policy: frame-ancestors 'none'
```

Or combined with the meta directives as a single header for full coverage.

## Hardening references

- [`.ai/rules/security.md`](.ai/rules/security.md) — internal security rules every agent obeys.
- [`.ai/rules/production-readiness.md`](.ai/rules/production-readiness.md) — six operational must-haves.
- [`.ai/architecture.md`](.ai/architecture.md) — canonical architecture reference (3 primitives, 3 layers, MCP power stack).
- OWASP Top 10 + OWASP LLM Top 10.
- Angular security guide: <https://angular.dev/best-practices/security>.
