---
mode: agent
description: Cut a release using nx release — pre-flight, release, post-release follow-ups
tools: ['editFiles', 'search', 'runCommands']
---

# Release

Uruchom release flow per [`.ai/agents/release-manager.md`](../../.ai/agents/release-manager.md).

## Inputs

- `${input:notes:Optional release notes (markdown bullets)}` — extra context dla GitHub release body

## Co robić

1. Przełącz na chat mode **release-manager** (lub śledź rolę inline). Załaduj `.ai/agents/release-manager.md`.
2. **Pre-flight verification:**
   - `main` jest zielony (CI passing).
   - Wszystkie release-blocking PRs są zmergowane.
   - Wszystkie accepted ADRs od ostatniego release są odzwierciedlone w `docs/`.
   - `pnpm typecheck && pnpm test && pnpm e2e && pnpm build && pnpm ai:validate` przechodzi zielono lokalnie.
3. **Cut release:** `pnpm release` (napędza `nx release` z Conventional Commits — bumpuje wersje, generuje `CHANGELOG.md`, taguje, tworzy GitHub release).
4. **Post-release:**
   - Dodaj entry do `docs/ai-workflow/runs/` z wersją, tagiem, summary changelog.
   - Otwórz issue `chore(release): post-vX.Y.Z follow-ups` listujący obserwacje i znane gapy.
   - Notify stakeholders per `docs/programming/git-workflow.md`.
5. Zakończ blokiem YAML `release:` z pliku roli.

## Nie

- Pomijaj pre-release checks — rola tego zabrania.
- Manualnie edytuj `CHANGELOG.md` — pozwól `nx release` regenerować.
- Release gdy CI jest czerwone.
- Używaj `--no-verify` ani `--force`.
