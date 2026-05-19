---
applyTo: '**/tools/**/*.{ts,mjs,js},**/shared/**/*.{ts,mjs,js}'
description: LLM token discipline — pre-flight estimation, response shaping, cache reuse
---

# LLM optimization (Copilot scope: MCP server source + shared extraction helpers)

Full text: [`.ai/rules/llm-optimization.md`](../../.ai/rules/llm-optimization.md).

> Trinity baseline. Three layers of token-cost defence, in best-ROI order: pre-flight estimation → response shaping → cache reuse. Applies to every MCP tool, every extraction pipeline, every response returning to an agent.

## The rules

1. **Estimate before you send.** Any operation returning > 50 000 tokens uses a `BudgetTracker` and returns `truncated: true` + `next` cursor instead of silently truncating.
2. **Compact JSON.** Drop `null` / `undefined` / empty arrays / empty objects. Use `compactJson()`. Never `JSON.stringify(v, null, 2)` to a model.
3. **Summarise long arrays.** Array > 50 items → return `summarizeArray()`: `{ head, tail, total, truncated: true }`.
4. **ADF / HTML → Markdown.** Use `adfToMarkdown()`. ~3× token reduction + better reasoning.
5. **Custom-field reshape.** Never send `customfield_NNNNN` to the model. Use `reshapeFieldValue()` — agent reads "Story Points", not "customfield_10042".
6. **Cache identical prompts.** Process-local LRU with TTL ≥ 60 s, keyed by `cacheKey([toolName, ...params])`. For long static tool descriptions, set Anthropic prompt cache `cache_control: { type: 'ephemeral' }`.
7. **English in MCP tool `description`.** Sent on every `list_tools`. Polish tokenises ~1.4× more expensively. Short, verb-led English.
8. **Only the needed fields.** Add a `fields: string[]` parameter; return only what's asked for.
9. **Truncate, don't crash.** `truncate(text, maxTokens, '\n…[truncated]')` always returns a string that fits.

## Default token budgets per task class

| Class                          | Budget  | Why                                                |
| ------------------------------ | ------- | -------------------------------------------------- |
| Single fetch (1 issue, 1 page) | 5 000   | No pagination needed                               |
| List / search (1–2 pages)      | 20 000  | Typical filtered query                             |
| Paginated search               | 60 000  | ~30 % of Claude 200k context, leaves room for chat |
| Bulk export (with truncation)  | 100 000 | Single-call max                                    |
| Compliance / full audit        | 150 000 | Special mode; orchestrator splits into sub-tasks   |

Override per tool via the `budget?: number` arg.

## Anti-patterns

- ❌ `JSON.stringify(value, null, 2)` to LLM.
- ❌ Returning full raw Atlassian payload.
- ❌ Sending full file contents when ±25 lines slice suffices.
- ❌ Polish in MCP tool `description`.
- ❌ Hard-cap "fetch 1000 latest" without `truncated` flag.
- ❌ Bare `console.log(huge_object)`.
- ❌ Full ADF JSON in a prompt (~3× the markdown).

## Reference implementations

`ai-mcp-alm/src/shared/`: `budget.ts`, `extract.ts`, `adf.ts`, `field-registry.ts`, `llm-optimize.ts`.
`ai-mcp-devtools/src/shared/`: `llm-optimize.ts` (mirror).

## Cross-references

- Production readiness §3 (monitoring) + §4 (cost control) → [`production-readiness.instructions.md`](production-readiness.instructions.md)
- Language rule (why MCP descriptions are English) → [`language.instructions.md`](language.instructions.md)
