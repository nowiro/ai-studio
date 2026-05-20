---
mode: agent
description: Sync technical docs with current code — doc-writer pass against the diff since last release
tools: ['editFiles', 'search', 'runCommands']
---

# Sync docs

Uruchom doc-writer pass przeciw diff między aktualnym `main` a ostatnim tagged release. Agent aktualizuje `docs/technical/`, `docs/programming/`, `docs/architecture/`, i `docs/ai-workflow/` żeby odzwierciedlały aktualny kod — bez wymyślania faktów.

## Co robić

1. Przełącz na chat mode **doc-writer** (lub śledź rolę inline). Załaduj `.ai/agents/doc-writer.md`, `.ai/rules/language.md` (polski dla tych powierzchni), `.ai/rules/principles.md`.
2. Oblicz diff window: `git log --oneline $(git describe --tags --abbrev=0)..HEAD`.
3. Dla każdego commita w scope, identyfikuj które doc powierzchnie dotyka (per "Update triggers" roli doc-writer):
   - Public-API change (component selector, service method, route, schema) → update `docs/technical/`.
   - Accepted ADR → turn it into "How it works" entry w `docs/architecture/` lub `docs/technical/`.
   - Nowy agent / workflow w `.ai/` → mirror summary w `docs/ai-workflow/`.
   - Lint / link-check drift → fix in place.
4. **Verify before rewriting** — open touched code; ufaj plikowi, nie docowi.
5. Apply diffs (nie rewrites) gdzie doc tylko drift w części.
6. Uruchom `pnpm docs:lint` i `pnpm ai:validate` żeby potwierdzić well-formedness.
7. Otwórz pojedynczy PR `docs: sync against vX.Y.Z` z bullet listą zmienionych docs.

## Nie

- Wymyślać faktów. Jeśli doc twierdzi coś czego nie ma w kodzie, **usuń claim** zamiast go przepisywać.
- Bundlować strukturalnych zmian (renamed sections, nowe pages) — te idą przez `regenerate-docs` po `audit-docs`.
- Dotykać analytical specs (analyst jest właścicielem) ani ADRs (architect jest właścicielem).
