---
applyTo: '**'
description: Security rules — secrets, sanitisation, AI surfaces
---

# Security (Copilot scope: every file)

Full text: [`.ai/rules/security.md`](../../.ai/rules/security.md).

## Secrets

- **Never** put API keys / OAuth secrets / service-account JSON in source, environment files shipped to client, `.ai/`, `.github/`, commit messages, ADRs or test fixtures.
- Local secrets live in `.env.local` (gitignored). Production secrets live in the platform's secret manager.
- Client-side AI calls go through a **server-side proxy** (Cloud Function / Genkit flow).

## Input handling

- Sanitise URLs with `DomSanitizer` before binding to `[innerHTML]`, `[src]`, `[href]`, `[style]`.
- Validate every external payload with **Zod** at the boundary. Reject before it reaches stores.
- File uploads: enforce MIME + size **on the server**.
- Forms POST endpoints with CSRF protection (handled by HTTP interceptor).

## Output handling

- No PII in logs. `LoggerService` redacts emails / tokens / GUIDs.
- Generic user-facing error messages; details to server log.
- No third-party `<script>` tags. Use Angular's resource APIs.

## AI-specific

- Treat **every** model output as untrusted text. Render via interpolation, not `[innerHTML]`. Markdown output → sanitise via `DOMPurify`.
- Tool calls that mutate state require **explicit user confirmation** in the UI.
- Memory and context files are read-only for agents in production runs. Writes go through PRs.

## Dependencies

- `pnpm audit --prod` runs in CI. High/critical advisories block merge until triaged.
- New dependencies need an entry in [`docs/architecture/dependencies.md`](../../docs/architecture/dependencies.md).

## When triggered (Copilot)

If you find yourself about to write code that:

- reads `process.env.*` in a file under `apps/<app>/src/`,
- assigns to `[innerHTML]`,
- imports a `<script>` tag,
- adds a new dependency,

**stop and ask the user first**, citing this rule.
