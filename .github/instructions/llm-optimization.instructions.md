---
applyTo: '**/tools/**/*.{ts,mjs,js},**/shared/**/*.{ts,mjs,js}'
description: LLM token discipline — pre-flight estimation, response shaping, cache reuse
---

# Optymalizacja LLM (Copilot scope: MCP server source + shared extraction helpers)

Pełny tekst: [`.ai/rules/llm-optimization.md`](../../.ai/rules/llm-optimization.md).

> Trinity baseline. Trzy warstwy obrony token-cost, w kolejności best-ROI: pre-flight estimation → response shaping → cache reuse. Dotyczy każdego MCP toola, każdego extraction pipeline'u, każdej response wracającej do agenta.

## Reguły

1. **Estymuj zanim wyślesz.** Każda operacja zwracająca > 50 000 tokens używa `BudgetTracker` i zwraca `truncated: true` + cursor `next` zamiast cichej trunkacji.
2. **Kompaktowy JSON.** Wyrzuć `null` / `undefined` / puste arrays / puste obiekty. Używaj `compactJson()`. Nigdy `JSON.stringify(v, null, 2)` do modelu.
3. **Streszczaj długie tablice.** Tablica > 50 items → zwróć `summarizeArray()`: `{ head, tail, total, truncated: true }`.
4. **ADF / HTML → Markdown.** Używaj `adfToMarkdown()`. ~3× redukcja tokenów + lepszy reasoning.
5. **Custom-field reshape.** Nigdy nie wysyłaj `customfield_NNNNN` do modelu. Używaj `reshapeFieldValue()` — agent czyta "Story Points", nie "customfield_10042".
6. **Cache identycznych promptów.** Process-local LRU z TTL ≥ 60 s, kluczowane przez `cacheKey([toolName, ...params])`. Dla długich static tool descriptions ustaw Anthropic prompt cache `cache_control: { type: 'ephemeral' }`.
7. **English w MCP tool `description`.** Wysyłane przy każdym `list_tools`. Polski tokenizuje się ~1.4× drożej. Krótki, czasownikowy angielski.
8. **Tylko potrzebne pola.** Dodaj parametr `fields: string[]`; zwracaj tylko to, co requested.
9. **Truncate, nie crash.** `truncate(text, maxTokens, '\n…[truncated]')` zawsze zwraca string mieszczący się.

## Domyślne budżety tokenów per klasa zadania

| Klasa                          | Budget  | Dlaczego                                              |
| ------------------------------ | ------- | ----------------------------------------------------- |
| Single fetch (1 issue, 1 page) | 5 000   | Pagination niepotrzebny                               |
| List / search (1–2 stron)      | 20 000  | Typowe filtered query                                 |
| Paginated search               | 60 000  | ~30 % kontekstu Claude 200k, zostawia miejsce na chat |
| Bulk export (z trunkacją)      | 100 000 | Single-call max                                       |
| Compliance / full audit        | 150 000 | Special mode; orchestrator dzieli na sub-tasks        |

Override per tool przez arg `budget?: number`.

## Anti-patterns

- ❌ `JSON.stringify(value, null, 2)` do LLM.
- ❌ Zwracanie pełnego raw payload Atlassian.
- ❌ Wysyłanie pełnych zawartości plików gdy wystarczy slice ±25 linii.
- ❌ Polski w MCP tool `description`.
- ❌ Hard-cap "fetch 1000 latest" bez flagi `truncated`.
- ❌ Bare `console.log(huge_object)`.
- ❌ Full ADF JSON w prompcie (~3× markdown).

## Reference implementations

`ai-mcp-alm/src/shared/`: `budget.ts`, `extract.ts`, `adf.ts`, `field-registry.ts`, `llm-optimize.ts`.
`ai-mcp-devtools/src/shared/`: `llm-optimize.ts` (mirror).

## Cross-references

- Production readiness §3 (monitoring) + §4 (cost control) → [`production-readiness.instructions.md`](production-readiness.instructions.md)
- Reguła językowa (czemu MCP descriptions są w angielskim) → [`language.instructions.md`](language.instructions.md)
