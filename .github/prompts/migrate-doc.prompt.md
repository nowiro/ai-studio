---
mode: agent
description: Migrate a single legacy doc to the AI Studio template
tools: ['editFiles', 'search', 'runCommands']
---

# Migrate doc

Konwertuj jeden legacy document do kanonicznego templatu pod `docs/` (lub `.ai/`).

## Inputs

- `${input:source:Path to the legacy doc}` — gdzie żyje input
- `${input:target:Target directory under docs/ or .ai/}` — gdzie ma wylądować nowy doc
- `${input:type:Doc type (technical|analytical|programming|ai-workflow|adr|spec|rule|agent|workflow|prompt|context)}`

## Co robić

1. Załaduj `.ai/agents/doc-auditor.md` (agent migracji).
2. Read source file. Wyekstraktuj:
   - Intent (do czego jest ten doc?)
   - Audience (engineer / analyst / agent / reviewer)
   - Konkretne fakty (file paths, commands, code snippets)
   - Stale claims (cokolwiek, co przeczy current code — flag, nie carry over)
3. Wybierz kanoniczny template:
   - Technical doc → patrz skeletony [`docs/technical/`](../../docs/technical/).
   - Analytical spec → skeleton [`.ai/agents/analyst.md`](../../.ai/agents/analyst.md).
   - ADR → [`docs/adr/0000-template.md`](../../docs/adr/0000-template.md).
   - Agent role → frontmatter + standardowe sekcje roli (patrz istniejące pliki w `.ai/agents/`).
   - Workflow / prompt / rule → mirror strukturę najbliższego istniejącego pliku.
4. Produkuj nowy plik pod `${target}` z proper frontmatter i wypełnionym template skeletonem.
5. Dodaj one-line entry do relevant index (`docs/README.md`, `.ai/README.md`, lub analogiczne).
6. Uruchom `pnpm ai:validate` żeby potwierdzić że nowy plik jest well-formed.

## Nie

- Carry stale facts forward bez weryfikacji przeciw current code.
- Pomijaj frontmatter — walidator zawiedzie.
- Usuwaj source file (człowiek decyduje kiedy retire).
