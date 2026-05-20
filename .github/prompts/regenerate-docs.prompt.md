---
mode: agent
description: Regenerate docs from a doc-audit report
tools: ['editFiles', 'search', 'runCommands']
---

# Regenerate docs from audit

Uruchamiaj **po** `audit-docs`. Czyta najnowszy raport pod `tmp/doc-audit-*.md` i przepisuje affected docs.

## Co robić

1. Znajdź najnowszy raport `tmp/doc-audit-*.md`. Jeśli brakuje, uruchom `audit-docs` prompt najpierw.
2. Załaduj `.ai/agents/doc-auditor.md` plus `.ai/agents/doc-writer.md`.
3. Dla każdego must-fix item:
   - **Drift**: open doc, replace stale section z current truth (waliduj przeciw kodowi przez touched file).
   - **Broken link**: fix lub usuń link.
   - **Missing frontmatter**: dodaj kanoniczny blok.
   - **Undocumented public export**: append sekcję do lib's `README.md` i linkuj z `docs/architecture/dependencies.md`.
4. Re-run `pnpm docs:audit` żeby potwierdzić nowy stan.
5. Otwórz pojedynczy PR titled `docs(audit): regenerate from <date> report` z:
   - bullet list zmienionych docs,
   - link do oryginalnego audit report,
   - delta w audit summary numbers (before/after).

## Nie

- Wymyślać faktów. Jeśli doc twierdzi coś czego nie ma w kodzie, **usuń claim** zamiast go przepisywać.
- Bundlować strukturalnych zmian (nowe pages, renamed sections) — te wymagają osobnego PR.
