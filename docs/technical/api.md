# API contracts

> Source of truth for every endpoint exposed by `apps/*` servers and BFF layers. Generated from OpenAPI / Genkit flow definitions where possible.

## Conventions

- REST resources, plural nouns: `/invoices`, `/workspaces`.
- Errors follow [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807) (Problem+JSON).
- Versioning via `Accept: application/vnd.ai-studio.v1+json` header — never path-versioned.
- Idempotent mutations require `Idempotency-Key` (UUID v7).
- Pagination via `?cursor=…&limit=…`.
- Rate limiting: `X-RateLimit-*` headers, 429 with `Retry-After`.

## Authentication

OAuth2 + PKCE, bearer JWT in `Authorization`. Tokens issued by the platform's IdP (placeholder until ADR lands).

## Endpoints (placeholders)

### `GET /api/invoices`

| Field              | Notes                                |
| ------------------ | ------------------------------------ |
| `cursor` (query)   | optional                             |
| `limit` (query)    | default 50, max 200                  |
| Response           | `{ data: Invoice[], nextCursor? }`   |

### `POST /api/summarise`

| Field      | Notes                                    |
| ---------- | ---------------------------------------- |
| Body       | `{ text: string, audience: 'exec' \| 'engineer' \| 'support' }` |
| Response   | `{ summary: string, bullets: string[] }` |
| Auth       | required                                 |
| Rate limit | 30 / minute / user                       |

> Each new endpoint adds a row here **and** a Zod schema in `libs/util/schemas`. The doc-writer agent enforces this on PRs touching server routes.
