---
id: docs.bpmn
title: BPMN — business process schemas
type: index
status: living
date: 2026-05-19
---

# BPMN — business process schemas

> Schematy BPMN 2.0 XML dla 10 procesów biznesowych demo-aplikacji i wspólnych warstw (Keycloak, MFE, Web Components). Każdy plik `.bpmn` to walidny dokument otwieralny w [bpmn.io](https://bpmn.io/), walidowany przez `bpmnlint` (po dołożeniu toolchainu — patrz [`PLAN.md`](../../PLAN.md) krok 5).

## Po co BPMN obok Mermaid

Mermaid diagramy żyją w `docs/projects/<app>/business.md` i są świetne dla developerów. BPMN dodaje:

- **Lingua franca z analizą biznesową** — analitycy biznesowi po stronie klienta czytają BPMN natywnie.
- **Walidacja** — `bpmnlint` wymusza poprawność.
- **Import do silników BPM** — Camunda, Signavio, Bizagi importują nasze `.bpmn` bezpośrednio.
- **Generowane SVG/PNG** — `pnpm bpmn:render` produkuje obrazki commitowane obok źródła.

Pozycja BPMN w SDD: rekomendowana Phase 1.5 w `spec-driven.md` (patrz ADR-0015 — planowane).

## Procesy

| Plik                                                             | Proces                                                        | App / scope                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------ |
| [`tire-shop-checkout.bpmn`](tire-shop-checkout.bpmn)             | Koszyk → 4-step checkout → potwierdzenie                      | `tire-shop`                          |
| [`library-loan-flow.bpmn`](library-loan-flow.bpmn)               | Wyszukaj → rezerwacja → wypożyczenie → zwrot                  | `library`                            |
| [`library-overdue-handling.bpmn`](library-overdue-handling.bpmn) | Daily timer → mark overdue → calc fine → KPI                  | `library`                            |
| [`school-journal-grading.bpmn`](school-journal-grading.bpmn)     | Term + class + student → ocena → agregacja                    | `school-journal`                     |
| [`bookstore-purchase.bpmn`](bookstore-purchase.bpmn)             | shop-core flow (reusable: tools-shop, toy-shop)               | `bookstore` + 2×                     |
| [`individual-wizard-submit.bpmn`](individual-wizard-submit.bpmn) | 5-step (PESEL → adres → preferencje → RODO → review)          | `individual-wizard`                  |
| [`business-wizard-submit.bpmn`](business-wizard-submit.bpmn)     | 6-step B2B (firma → osoba → branża → cele → kontakt → review) | `business-wizard`                    |
| [`keycloak-auth-flow.bpmn`](keycloak-auth-flow.bpmn)             | Login → token → role → guard                                  | cross-cutting (`libs/keycloak-auth`) |
| [`mfe-portal-load.bpmn`](mfe-portal-load.bpmn)                   | Portal init → manifests parallel → lazy load → render         | cross-cutting (`apps/portal`)        |
| [`web-component-embed.bpmn`](web-component-embed.bpmn)           | Host load → ESM → define → standalone vs federated → mount    | cross-cutting (ADR-0012)             |

## Toolchain (planowany — patrz [`PLAN.md`](../../PLAN.md) kroki 5-8)

```bash
pnpm bpmn:lint     # bpmnlint docs/bpmn/**/*.bpmn
pnpm bpmn:render   # bpmn-to-image — SVG do docs/bpmn/<name>.svg
```

Pre-commit hook (`.husky/pre-commit`) wywołuje `pnpm bpmn:lint`. CI workflow (`.github/workflows/bpmn.yml`) renderuje SVG.

## Konwencje nazewnictwa

- Pliki: `<app|scope>-<process>.bpmn` (kebab-case).
- `id="Process_<slug>"`, `id="StartEvent_1"`, `id="Task_<PascalCase>"`, `id="Gateway_<PascalCase>"`, `id="EndEvent_<PascalCase>"`, `id="Flow_<n>"`.
- Wszystkie nazwy zadań (`name=`) po angielsku — tooling-readable.
- Dokumentacja procesowa (`<bpmn:documentation>`) po angielsku, krótka.

## Mapowanie do kodu

- Service tasks używają nazw zgodnych z faktycznymi funkcjami / serwisami (np. `ShopCartService`, `roleGuard`, `loadRemoteModule`).
- Każdy `docs/projects/<app>/README.md` linkuje do swojego BPMN-a we frontmatter (`bpmn: ../../bpmn/<slug>.bpmn`) — patrz [`PLAN.md`](../../PLAN.md) krok 9.
