---
id: prompt.write-spec
title: Write spec
type: prompt
target_agent: analyst
version: 2.0.0
---

# Write Spec prompt

Używaj tego gdy Orchestrator deleguje spec writing do **analyst**.

## Inputs

- `{{REQUEST}}` — verbatim user request.
- `{{PERSONAS}}` — lista relevant persona ids z `.ai/context/personas.md`.

## Task

Produkuj `docs/analytical/specs/<YYYY-MM-DD>-<slug>.md` zgodnie z skeleton w `.ai/agents/analyst.md`. **Nie** pisz kodu. **Nie** proponuj architektury (to robota architekta).

Constraints:

- Acceptance criteria musi być **Given/When/Then** i **observable z zewnątrz systemu**.
- Przynajmniej jeden negative path (error / empty / boundary) per user story.
- Nie więcej niż 5 user stories per spec — split jeśli potrzeba.
- Estimated effort w t-shirt sizes (XS/S/M/L/XL) na każdej story.

## Output checklist

- ✅ Persony referenced (żadnych wymyślonych).
- ✅ Goals i non-goals oba wypełnione.
- ✅ Success metrics measurable w istniejącym analytics stack.
- ✅ Risks table z mitigations.
- ✅ Hand-off line na końcu (który agent next).

## End with

```yaml
hand_off:
  next: architect | frontend-developer | …
  rationale: <jedno zdanie>
```
