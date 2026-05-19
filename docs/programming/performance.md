# Performance budget

> Concrete budgets the Orchestrator enforces. Updated when an ADR raises or lowers a number.

## App-level

| Metric               | Budget   | Tool                   |
| -------------------- | -------- | ---------------------- |
| Initial JS (gzipped) | < 200 kB | `nx build`, source-map |
| LCP (P75 mobile)     | < 2.5 s  | Lighthouse CI          |
| TBT (P75 mobile)     | < 200 ms | Lighthouse CI          |
| CLS                  | < 0.1    | Lighthouse CI          |
| First-route TTI      | < 3 s    | Lighthouse CI          |

Budget bust → CI fails on Lighthouse score < threshold.

## Tests

| Suite               | Budget            |
| ------------------- | ----------------- |
| Unit per project    | ≤ 30 s            |
| Integration per app | ≤ 1 min           |
| E2E per app (CI)    | ≤ 5 min wallclock |

## CI

| Job               | P95 budget |
| ----------------- | ---------- |
| Lint              | ≤ 2 min    |
| Typecheck         | ≤ 3 min    |
| Test              | ≤ 5 min    |
| Build             | ≤ 6 min    |
| E2E (per browser) | ≤ 8 min    |

P95 budget over a rolling 30 days. If we breach, file a tech-debt issue.

## Bundle hygiene

- Lazy-load every feature via `loadComponent`.
- `@defer` heavy templates that aren't on the critical path.
- `NgOptimizedImage` for static images.
- Tree-shake unused exports — buildable libs only when justified.
- No moment.js, lodash full bundle, etc. — use date-fns + per-function imports.

## Server-side

- Genkit flow P95 latency target depends on the flow (declare in the ADR).
- Cache LLM responses by content hash where the flow is deterministic enough.
