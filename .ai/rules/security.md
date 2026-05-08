---
id: rules.security
title: Security rules
type: rules
scope: security
priority: 1
version: 1.0.0
---

# Security rules

## 1. Secrets

- **Never** put API keys, OAuth secrets or service account JSON in:
  - source code (`*.ts`, `*.html`, `*.scss`),
  - environment files shipped to the client (`environments/*.ts`),
  - `.ai/` or `.claude/` configuration,
  - commit messages, PR descriptions, ADRs,
  - test fixtures.
- Local secrets live in `.env.local` (gitignored).
- Production secrets live in the platform's secret manager (Firebase secrets, AWS SM, GCP Secret Manager, …).
- Client-side AI calls **must** go through a server-side proxy (Cloud Function / Genkit flow) that holds the key.

## 2. Input handling

- Sanitise every URL with `DomSanitizer` before passing to `[innerHTML]`, `[src]`, `[href]`, `[style]`.
- Validate every external payload with a schema (Zod / Valibot). Reject before it reaches the store.
- File uploads: enforce MIME + size on the server; client checks are UX-only.
- All forms post to endpoints that require CSRF protection (handled by HTTP interceptor).

## 3. Output handling

- No PII in logs. The `LoggerService` redacts emails, tokens, GUIDs by default.
- Error messages shown to the user are generic; details go to the server log.
- No third-party scripts via `<script>`. Use Angular's resource APIs.

## 4. AI-specific

- Treat **every** model output as untrusted text:
  - Render through `[textContent]` / interpolation, not `[innerHTML]`.
  - If the output is meant to be rendered as Markdown, sanitise via `DOMPurify` first.
- Tool calls triggered by an LLM that mutate state require **explicit user confirmation** in the UI.
- Memory and context files are read-only for agents in production runs. Writes go through PRs.

## 5. Dependencies

- `pnpm audit --prod` runs in CI; high/critical advisories block merge until triaged.
- New dependencies require an entry in `docs/architecture/dependencies.md` (why this lib, alternatives considered).
- Lock down peer ranges in `package.json`; renovate/dependabot proposes updates.

## 6. Auth flows (when added)

- Use OIDC + PKCE; never the deprecated implicit flow.
- Tokens stored in **httpOnly, SameSite=Strict** cookies — not `localStorage`.
- Logout invalidates server-side; client just discards.

## 7. CSP

- Production responses serve a strict Content-Security-Policy: `default-src 'self'; script-src 'self'; ...`.
- No `'unsafe-inline'`. Use Angular's `provideCSPNonce` or hash-based CSP.

## 8. Reporting

- Suspected vulnerability → `SECURITY.md` instructions (private disclosure).
- The `security-auditor` agent runs against every PR touching auth, sanitisation, dependencies, or CSP.
