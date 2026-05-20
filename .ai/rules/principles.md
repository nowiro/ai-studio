---
id: rules.principles
title: Zasady inżynierskie — DRY, SOLID, KISS, YAGNI
type: rules
scope: global
priority: 1
version: 2.0.0
---

# Zasady inżynierskie

To **złote reguły**, na których opiera się każdy agent i kontrybutor gdy nie ma pewności. Siedzą obok [`core.md`](core.md) na szczycie łańcucha priorytetu. Nie zastępują specyficznych reguł stacka (Angular, styling, testing, security) — są meta-regułami, które te reguły wcielają.

Gdy dwie zasady konfliktują, **wygrywa klarowność**. Pisz kod, który ludzie chcą utrzymywać.

## 1. DRY — Don't Repeat Yourself

Każdy kawałek wiedzy ma jedną, autorytatywną reprezentację.

- Ten sam intent pojawia się w trzech lub więcej miejscach → wyekstraktuj.
- **Ale**: nie deduplikuj kodu, który _wygląda_ podobnie, ale reprezentuje _różne_ concerns. Trzy identyczne linie nieskorelowanej logiki to nie duplikacja; abstrahowanie ich sprzęga futures, które powinny pozostać niezależne.
- Heurystyka: deduplikuj **wiedzę**, nie **linie**. Jeśli obie kopie muszą się zmienić z tego samego powodu, były duplikacją; jeśli zmieniają się z różnych powodów, nie są.

| Dobrze                                                            | Źle                                       |
| ----------------------------------------------------------------- | ----------------------------------------- |
| Jeden Zod schema w `libs/util/schemas` reused przez API + form    | Ten sam schema duplikowany w 3 komponentach |
| Jeden `LoggerService` który wszyscy injectują                     | Pięć wrapperów `console.log` po libach    |
| Jeden Tailwind token (`bg-primary`) źródłujący Material design var | Hardcoded `#6750a4` w 12 komponentach     |

## 2. KISS — Keep It Simple

Wybierz najprostsze rozwiązanie, które rozwiązuje problem **taki jaki istnieje dziś**. Sprytność, której future-you nie potrafi przeczytać na pierwszy rzut oka, to bug.

- Wybieraj plain functions zamiast klas, gdy stan nie jest potrzebny.
- Wybieraj signals zamiast RxJS, gdy stream semantics nie są potrzebne.
- Wybieraj built-in komponenty Material zamiast hand-rolled.
- Wybieraj `@if` / `@for` zamiast budowy custom dyrektywy.
- Unikaj metaprogramowania (decorators-creating-decorators, dynamic class generation) chyba że jest zmierzona wygrana.

Jeśli łapiesz się na pisaniu komentarzy, żeby wyjaśnić _co_ kod robi, kod nie jest prosty.

## 3. YAGNI — You Aren't Gonna Need It

Nie dodawaj capability, której aktualne zadanie nie wymaga.

- Żadnych "future-proof" abstrakcji. Dodaj je gdy wyląduje drugi konkretny use case.
- Żadnych config flags dla behaviour którego nikt nie pyta.
- Żadnych backwards-compatibility layers dla kodu, który nie został wydany.
- Żadnego dead code "just in case".

Jeśli kontrybutor argumentuje "być może będziemy potrzebować X później" — dostaje dodać X **później**, z prawdziwym spec.

## 4. SOLID

Dla object-oriented i signal-oriented kodu jednakowo. Angular services, components i directives są tu typowymi "obiektami".

### S — Single Responsibility

Klasa / komponent / funkcja ma **jeden powód do zmiany**.

- Komponent który fetchuje dane **i** renderuje **i** dispatchuje analytics ma trzy powody. Rozdziel.
- Service który obsługuje auth **i** caching **i** logging ma trzy powody. Rozdziel.

### O — Open / Closed

Kod jest otwarty na rozszerzenie, zamknięty na modyfikację.

- Dodawaj nowy behaviour przekazując strategy / signal / function, nie edytując switch statement, który rośnie liniowo.
- Używaj signal-driven configuration (`provideXxx({ adapter })`) zamiast dziedziczenia.

### L — Liskov Substitution

Jeśli `B extends A`, `B` musi działać wszędzie tam gdzie działa `A` bez zaskakiwania callerów.

- Nie overridee metody żeby rzuciła, zwróciła `null`, lub zmieniła swój kontrakt.
- Wybieraj kompozycję; dziedzicz tylko gdy relacja "is-a" naprawdę zachodzi.

### I — Interface Segregation

Wiele wąskich interfaces pokonuje jeden szeroki.

- Konsument, który potrzebuje tylko `read()`, nie powinien zależeć od typu, który eksponuje też `write()` i `delete()`.
- Używaj Angular `inject(MY_TOKEN)` z małym interface tokenem, nie pełną klasą service.

### D — Dependency Inversion

Zależ od abstrakcji, nie od konkretów — ale tylko gdzie substytucja jest faktycznie użyteczna.

- High-level features zależą od interface `BillingPort`; low-level adapters go implementują.
- To **nie** licencja na wrapowanie każdego service w interface "dla testability". TestBed już obsługuje substytucję.

## 5. Composition over inheritance

Dziedziczenie tworzy sztywne hierarchie. Kompozycja tworzy Lego.

- W Angular: wybieraj wiele małych standalone komponentów komponowanych w template zamiast jednego dużego komponentu z subclasses.
- W services: wybieraj injectowanie kolaboratorów zamiast dziedziczenia behaviour.
- Mixins i abstract classes są ostatnimi resortami.

## 6. High cohesion, low coupling

Rzeczy, które zmieniają się razem, żyją razem. Rzeczy, które zmieniają się niezależnie, pozostają osobno.

- Feature library ma route container + smart komponenty + feature-local services. Zmieniają się razem.
- UI library ma dumb presentational komponenty. Nie wiedzą o features.
- Sprzężenie między libami wymuszane przez `@nx/enforce-module-boundaries` (patrz [`nx.md`](nx.md)).

## 7. Boy Scout Rule

Zostaw kod trochę lepszym niż go zastałeś — ale **scoped do zadania**.

- Bug-fix PR: zmień nazwę zmyleniającej local variable. ✅
- Bug-fix PR: refactor 200-linowego service. ❌ (otwórz osobny tech-debt issue).

Ta reguła jest o **małych, opportunistic** ulepszeniach, nie o unsolicited rewrites.

## 8. Principle of Least Astonishment

Kod powinien robić to, co sugeruje jego nazwa, ni mniej, ni więcej.

- Funkcja `getInvoices()` nie wysyła też analytics events.
- Signal `total()` nie zwraca formatted string.
- Selektor komponentu `ais-button` nie renderuje `<div>`.

Jeśli musisz zaskoczyć czytelnika, komentarz jest wymagany.

## 9. Fail fast, fail loud

Błędy na granicy, nie głęboko w kodzie.

- Waliduj każdy external payload na granicy HTTP (Zod). Odrzucaj wcześnie.
- Nie coerce po cichu `null` na defaulty — ujawnij brakujący input.
- Output modelu AI: schema-bound (Zod) — nigdy nie parse free text na business decisions.

## 10. Convention over configuration

Wybierz konwencję, udokumentuj ją raz, stosuj wszędzie.

- Nazwy plików: `kebab-case` (konwencja Angular).
- Selektory: `ais-*`.
- Module boundaries: wymuszane przez Nx tags.
- Commits: Conventional Commits.

Gdy nowy kontrybutor (człowiek lub AI) pyta "gdzie powinien iść X?", odpowiedź powinna już być w `.ai/` lub `docs/programming/`.

## 11. Reversibility — małe, bezpieczne kroki

Duże zmiany są straszne. Wiele małych zmian to rutyna.

- Jeden concern na PR. Reviewable w jednym posiedzeniu.
- Generatory (Nx, Angular CLI, Material schematics) zamiast hand-edits.
- Feature flags / `@defer` bloki dla ryzykownych launches.
- ADRs dla decyzji trudnych do odwrócenia.

## 12. Kod jest czytany więcej niż pisany

Optymalizuj dla następnego czytelnika, nie aktualnego writera.

- Nazwy zamiast komentarzy.
- Explicit types zamiast inferred na granicach API.
- Jedno zdanie na linię markdown dla czystych diffów.
- Przykłady w plikach ról agentów i promptach żeby nowe narzędzia szybko się onboardowały.

## Jak agenci to stosują

Każdy agent ładuje ten plik na początku swojego zadania. Gdy dwa konkurujące podejścia oba spełniają immediate spec, agent wybiera to bliższe tym zasadom i notuje trade-off w swoim hand-off bloku. Code reviewer, który spostrzega naruszenie, cytuje **id zasady** (np. _SRP_, _KISS_) — nie mgliste "to wygląda źle".

## Czym te NIE są

- **Nie checklistą.** PR nie musi demonstrować każdej zasady.
- **Nie przykazaniami.** Realny kod czasem narusza zasadę z zmierzonego powodu. Udokumentuj powód.
- **Nie substytutem dla spec rules.** Konwencje Angular, reguły security i Nx boundaries nadal obowiązują.

## Zobacz też

- [`core.md`](core.md) — nienegocjowalne cross-cutting reguły.
- [`angular.md`](angular.md), [`styling.md`](styling.md), [`testing.md`](testing.md), [`nx.md`](nx.md), [`security.md`](security.md) — stack-specific.
- [`docs/programming/coding-standards.md`](../../docs/programming/coding-standards.md) — konkretne przepisy.
