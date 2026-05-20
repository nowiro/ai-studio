---
mode: agent
description: Audit docs against current code and produce a compliance report
tools: ['editFiles', 'search', 'runCommands']
---

# Audit docs

Śledź workflow w [`.ai/workflows/documentation-audit.md`](../../.ai/workflows/documentation-audit.md).

## Co robić

1. Uruchom deterministyczne skanery:

   ```bash
   pnpm docs:scan          # tools/scripts/scan-docs.mjs
   pnpm docs:api            # tools/scripts/scan-public-api.mjs
   pnpm docs:audit          # tools/scripts/doc-audit.mjs → tmp/doc-audit-<date>.md
   ```

2. Załaduj `.ai/agents/doc-auditor.md`. Read `tmp/doc-audit-<date>.md`.
3. Dla każdego finding klasyfikuj: **must-fix** (drift / broken link / missing frontmatter), **should-fix** (undocumented public API), **nice-to-have** (kosmetyczne).
4. Otwórz jedno issue per cluster related findings używając `.github/ISSUE_TEMPLATE/documentation.yml`. Linkuj audit report.
5. Zakończ verdict YAML zdefiniowanym w pliku roli doc-auditor.

## Nie

- Otwieraj dziesiątek micro-issues — grupuj wg area / library.
- Przepisuj docs w tym kroku. Używaj `regenerate-docs` do tego.
- Markuj `done:` gdy must-fix items zostają unaddressed.
