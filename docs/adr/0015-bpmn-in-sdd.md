# 0015 — BPMN jako artefakt Phase 1.5 w Spec-Driven Development

- Status: proposed
- Date: 2026-05-19
- Decision-makers: maintainers
- Consulted: analyst, architect, biznes/PM
- Informed: all contributors

## Context and problem statement

Trinity (ai-studio, ai-mcp-alm, ai-mcp-devtools) opisuje procesy biznesowe wyłącznie prozą + Mermaid w `business.md`. To wystarcza developerom, ale:

- Analitycy biznesowi po stronie klienta czytają BPMN natywnie i nie umieją importować Mermaid do Camundy / Signavio / Bizagi.
- `bpmnlint` umie walidować BPMN — nie ma odpowiednika dla Mermaid.
- Procesy demo (tire-shop checkout, library loan, school-journal grading, wizardy, MFE portal, Keycloak auth) są referencyjne — repo chce je sprzedawać jako wzorzec, więc lingua franca BPM jest wartością.

Pytanie: gdzie w cyklu Spec-Driven Development (`.ai/workflows/spec-driven.md`) BPMN powstaje?

## Decision drivers

- Minimalna inwazja w istniejący SDD (zachować Phase 1/2/3/4).
- Opcjonalność — CRUD nie potrzebuje BPMN, complex flow potrzebuje.
- Walidacja automatyczna (`bpmnlint`).
- Reusability — niektóre procesy są cross-cutting (shop-core, keycloak-auth, MFE).

## Considered options

1. **Phase 1.5 BPMN** pomiędzy Specify a Plan. Analyst owns it.
2. **Phase 2 inside Plan** — architect kreśli BPMN jako część `plan.md`.
3. **Brak BPMN w SDD** — pozostawić swobodnie autorom.

## Decision outcome

Wybieramy **opcję 1**: nowy opcjonalny **Phase 1.5 BPMN** w SDD.

### Reguły

1. **Opcjonalność**. Phase 1.5 wymagana, gdy spec ma > 3 user-decision points (XOR gateways), parallel work (parallel gateway), timer event (daily batch, retry), lub gdy proces jest cross-cutting (reusable między aplikacjami).
2. **Owner: analyst**. Powstaje obok `spec.md` w katalogu `docs/analytical/specs/<slug>/process.bpmn`. Architect (Phase 2) konsumuje BPMN i mapuje na `plan.md`.
3. **Format: BPMN 2.0 XML**, walidne dla bpmn.io, namespace `xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"`.
4. **Naming**. Plik `<process>.bpmn`. Identyfikatory `Process_<slug>`, `StartEvent_1`, `Task_<PascalCase>`, `Gateway_<PascalCase>`, `Flow_<n>`.
5. **Walidacja**. `pnpm bpmn:lint` w pre-commit hook + CI. `pnpm bpmn:render` produkuje SVG.
6. **Repozytorium BPMN**. Cross-cutting (reusable) BPMN żyje w `docs/bpmn/<slug>.bpmn`. Per-spec (jednorazowe) — w `docs/analytical/specs/<slug>/process.bpmn`.

### Consequences

- ➕ Analitycy biznesowi mają lingua franca.
- ➕ Walidacja `bpmnlint` wymusza poprawność procesów (każdy start ma end, każdy gateway >=2 wyjść).
- ➕ Cross-cutting procesy (shop-core, keycloak, MFE) są reusable.
- ➖ Krzywa uczenia — autorzy specy muszą umieć BPMN.
- ➖ Dwa źródła prawdy dla user journey (proza w spec.md + BPMN). Mitygacja: spec.md linkuje do BPMN-a, BPMN linkuje do spec.md w `<bpmn:documentation>`.

## Implementation plan

- [x] 10 BPMN-ów w `docs/bpmn/` (PLAN.md Faza 5).
- [x] BPMN README (`docs/bpmn/README.md`).
- [ ] Toolchain (PLAN.md kroki 4-8): `package.json` + `tools/scripts/bpmn-render.mjs` + `bpmnlint` w CI.
- [ ] Update `.ai/workflows/spec-driven.md` o Phase 1.5 (PLAN.md krok 10).
- [ ] Propagacja zmian spec-driven do `ai-mcp-alm` i `ai-mcp-devtools` (PLAN.md krok 11) — trinity baseline file.

## References

- [`docs/bpmn/README.md`](../bpmn/README.md)
- [`.ai/workflows/spec-driven.md`](../../.ai/workflows/spec-driven.md)
- [bpmn.io](https://bpmn.io/)
- [bpmnlint](https://github.com/bpmn-io/bpmnlint)
- [`PLAN.md`](../../PLAN.md) Faza 5
