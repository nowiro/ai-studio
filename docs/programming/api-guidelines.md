# API guidelines

> How we design REST endpoints (apps' BFF / server) and Genkit flows. Owned by the Architect; kept fresh by the Backend Developer.

## REST

- Resources are plural nouns: `/invoices`, `/workspaces`.
- Verbs in HTTP method, never path: `POST /invoices`, not `POST /createInvoice`.
- Versioning via `Accept` header: `Accept: application/vnd.ai-studio.v1+json`.
- Errors follow [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807) Problem+JSON.
- Idempotent mutations require `Idempotency-Key`.
- Pagination: cursor-based (`?cursor=…&limit=…`).
- Rate limiting: token bucket; respond with 429 + `Retry-After`.
- HATEOAS optional; if used, follow JSON:API.

## Schemas

- Zod schemas in `libs/util/schemas` are the single source of truth.
- Types derive via `z.infer<typeof X>`.
- Parse at the **boundary**: HTTP request, response, model output, file import.
- Return validation errors as Problem+JSON with `errors[]` listing each path.

## Versioning policy

- Major bump = ADR. We bump majors only when a contract becomes incompatible.
- Minor / patch happen automatically via `nx release` from conventional commits.

## Genkit / AI flows

- Every flow declares `inputSchema` and `outputSchema` (Zod).
- Tool-call functions also declare schemas — never free text.
- Temperature ≤ 0.3 for production flows unless creativity is the goal.
- Always log a Genkit trace id; expose to clients only when tracing is enabled.

## Authentication

- OAuth2 + PKCE; bearer JWT.
- No tokens in `localStorage`; httpOnly SameSite=Strict cookies for SPA, headers for service-to-service.
- `Authorization` header validated by middleware before any handler runs.

## Authorization

- Per-route policy in a `policies/` folder; never inline in handlers.
- Default deny: explicit `allow(...)` calls in policy.
- Policy mismatch returns 403 with a machine-readable code.

## Forbidden

- ❌ JSON-RPC-style endpoints (`POST /api { "method": ... }`).
- ❌ "Magic" query params that change response shape.
- ❌ Returning HTML from JSON endpoints.
- ❌ Allowing `*` CORS in production.
