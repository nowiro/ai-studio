---
id: rules.core
title: Reguły core — każdy agent, każde zadanie
type: rules
scope: global
priority: 1
version: 2.0.0
---

# Reguły core

Te reguły są nienegocjowalne. Nadpisują wszystko inne **z wyjątkiem** jawnej instrukcji użytkownika w czacie. Pliki niższego priorytetu (inne reguły, prompty agentów, workflows) rozszerzają je, ale nigdy nie osłabiają.

Ten plik pracuje w parze z [`principles.md`](principles.md) — tam są _inżynierskie_ zasady (DRY, SOLID, KISS, YAGNI). Oba ładują się na priority 1.

## 1. Prawda przed akcją

1.1 Przeczytaj odpowiedni kod zanim ogłosisz, że go znasz. Nigdy nie wymyślaj ścieżek plików, nazw funkcji, wersji pakietów ani API.
1.2 Gdy nie masz pewności, użyj serwera MCP **context7** żeby ściągnąć aktualne docs upstream (Angular, Nx, RxJS, Vitest, Playwright). Cytuj źródło w odpowiedzi.
1.3 Jeśli fakt pochodzi z `.ai/context/*.md`, linkuj do pliku. Pamięć ≠ ground truth — najpierw weryfikuj przeciw repo.

## 2. Najmniejsza rozsądna zmiana

2.1 Bug fix zmienia tylko to, co potrzebne dla buga. Żadnych drive-by refactorów.
2.2 Nowy feature używa istniejących prymitywów zanim wprowadzi nowe.
2.3 Trzy podobne linie są lepsze niż przedwczesna abstrakcja.
2.4 Żadnych pół-skończonych implementacji. Jeśli krok nie może się zakończyć, ujawnij blocker i zatrzymaj się — nie zaklejaj go.

## 3. Odwracalność i blast radius

3.1 Zawsze bezpieczne: edycja plików w `apps/`, `libs/`, `docs/`; uruchamianie testów, lint, typecheck, `nx graph`.
3.2 Najpierw potwierdź: usuwanie plików, force-push, drop migracji, mutowanie shared infra, publikowanie pakietów.
3.3 Zabronione bez jawnej per-action zgody użytkownika: `--no-verify`, `git reset --hard`, history rewrites, zapis sekretów, otwieranie PR przeciw `main` z czerwonym CI.

## 4. Definition of Done

Zadanie jest **done** tylko gdy:

- ✅ Lint przechodzi (`pnpm affected:lint`)
- ✅ Type-check przechodzi (`pnpm typecheck`)
- ✅ Unit testy przechodzą z ≥80 % statement coverage na touched code (`pnpm affected:test`)
- ✅ E2E smoke zielony dla affected apps (`pnpm affected:e2e`)
- ✅ Build się udaje (`pnpm affected:build`)
- ✅ Docs/ADR zaktualizowane gdy behaviour się zmienia
- ✅ Conventional commit + scoped PR description

Orchestrator NIE MOŻE oznaczyć `done` dopóki którykolwiek punkt nie jest spełniony.

## 5. Komunikacja

5.1 Bądź zwięzły. Stwierdzaj wyniki i decyzje; pomijaj narrację.
5.2 Cytuj ścieżki plików jako `path/to/file.ts:42` żeby użytkownik mógł kliknąć.
5.3 Ujawniaj niepewność — powiedz "nie wiem, oto jak się dowiedzieć" zanim zgadniesz.
5.4 Na końcu tury: jedno zdanie co się zmieniło, jedno co dalej.

## 6. Logi of record

6.1 Każdy multi-agent run produkuje wpis pod `docs/ai-workflow/runs/YYYY-MM-DD-<slug>.md` podsumowujący: requesting agent, delegations, MCP calls, files touched, validation outcome.
6.2 Decyzje architektoniczne idą do `docs/adr/NNNN-<slug>.md` (template MADR).
6.3 Jeśli pamięć przeczy repo, ufaj repo i aktualizuj pamięć.

## 7. Plan-first generation (HARD RULE)

7.1 **Żaden kod, dok, scenariusz ani test nie jest generowany bez pisemnego planu w markdown.** Dotyczy to features, bug fixów, refactorów, library scaffolding, regeneracji docs i pisania test-scenarios.
7.2 **Lokacje planów** (wybierz jedną — istniejący slot wygrywa):

- Praca SDD → `docs/analytical/specs/<slug>/plan.md` (architect-owned).
- Wszystko inne → `docs/ai-workflow/plans/<YYYY-MM-DD>-<slug>.md` (orchestrator-owned). Użyj [`_template.md`](../../docs/ai-workflow/plans/_template.md).
- Zmiany warte ADR również produkują `docs/adr/NNNN-<slug>.md`.
  7.3 **Multi-agent execution.** Orchestrator jest właścicielem planu i deleguje każde zadanie do specjalisty (analyst, architect, frontend/backend developer, test-engineer, test-scenario-author, doc-writer, code-reviewer, security-auditor, doc-auditor, release-manager). Specjaliści MUSZĄ odmówić delegacji, która nie cytuje ścieżki planu.
  7.4 **Wyjątek trivial-change.** Single-file edit który nie zmienia behaviour (typo, komentarz, formatting) nie potrzebuje planu. Cokolwiek dotyka ≥ 2 plików LUB dodaje/zmienia behaviour wymaga planu.
  7.5 **Cykl życia statusu planu.** `draft` → `accepted` → `in-progress` → `done` (lub `aborted`). Orchestrator musi aktualizować pole status i dopisywać one-liner do `docs/ai-workflow/runs/` gdy każda faza się zamyka.

## 8. Forbidden patterns

- ❌ API keys / sekrety w source, komentarzach, commit messages, plikach `.ai/`.
- ❌ `any` (TypeScript) poza uzasadnionymi, skomentowanymi wyjątkami.
- ❌ `console.log` w committed code (używaj logger service).
- ❌ Default exports poza plikami config.
- ❌ Pomijanie **Definition of Done** bo zmiana "wygląda mała".
- ❌ Generowanie kodu/docs/testów bez planu markdown cytowanego w delegacji (patrz §7).
- ❌ Specjalista pracujący solo nad multi-file change bez orchestrator-owned plan.

---

_Źródło: zbudowane na bazie rekomendacji `angular.dev/ai` i wytycznych prompt-engineering Anthropic._
