---
applyTo: '**'
description: Engineering principles — DRY, SOLID, KISS, YAGNI, composition over inheritance
---

# Zasady inżynierskie (Copilot scope: każdy plik)

Pełny tekst: [`.ai/rules/principles.md`](../../.ai/rules/principles.md).

## Krótka lista

| Principle                         | Stosuj gdy                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **DRY**                           | Ta sama _wiedza_ duplikowana w ≥ 3 miejscach. (Lookalike kod, który zmienia się z różnych powodów to **nie** duplikacja.) |
| **KISS**                          | Najprostsze rozwiązanie spełniające dzisiejszy spec wygrywa.                                                              |
| **YAGNI**                         | Nie buduj dla hipotetycznych przyszłych potrzeb. Dodaj capability gdy wyląduje drugi realny use case.                     |
| **SRP**                           | Jedna klasa / komponent / funkcja = jeden powód do zmiany.                                                                |
| **OCP**                           | Rozszerzaj przez injection / strategy, nie przez edytowanie rosnących switch statements.                                  |
| **LSP**                           | Subtyp musi działać wszędzie tam, gdzie działa supertyp.                                                                  |
| **ISP**                           | Wiele wąskich interfejsów pokonuje jeden szeroki.                                                                         |
| **DIP**                           | Zależ od abstrakcji gdzie substitution jest faktycznie użyteczna (TestBed, adaptery).                                     |
| **Composition over inheritance**  | Default. Dziedzicz tylko gdy "is-a" naprawdę zachodzi.                                                                    |
| **High cohesion, low coupling**   | Rzeczy, które zmieniają się razem, żyją razem.                                                                            |
| **Boy Scout rule**                | Małe opportunistic ulepszenia **scoped do zadania** — nigdy drive-by refactory.                                           |
| **Least Astonishment**            | Funkcja robi to, co mówi jej nazwa, nic więcej, nic mniej.                                                                |
| **Fail fast**                     | Waliduj na granicy (Zod). Nie coerce po cichu missing inputu.                                                             |
| **Convention over configuration** | Wybierz raz, udokumentuj, wymuszaj przez lint.                                                                            |

Gdy dwie zasady konfliktują, **wygrywa klarowność**.

## Cytowanie w reviews

Gdy flagujesz naruszenie, cytuj id zasady (`DRY`, `SRP`, `KISS`, …) — nie mgliste "to wygląda źle".

## Czym to NIE jest

- Checklistą dla każdego PR.
- Pozwoleniem na refactor nieskorelowanego kodu.
- Substytutem stack-specific reguł ([`angular.md`](../../.ai/rules/angular.md), [`styling.md`](../../.ai/rules/styling.md), …).
