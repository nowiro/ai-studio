---
id: prompt.write-spec
title: Write spec
type: prompt
target_agent: analyst
version: 1.0.0
---

# Write Spec prompt

Use this when the Orchestrator delegates spec writing to the **analyst**.

## Inputs

- `{{REQUEST}}` — verbatim user request.
- `{{PERSONAS}}` — list of relevant persona ids from `.ai/context/personas.md`.

## Task

Produce `docs/analytical/specs/<YYYY-MM-DD>-<slug>.md` following the skeleton in `.ai/agents/analyst.md`. **Do not** write code. **Do not** propose architecture (that's the architect's job).

Constraints:

- Acceptance criteria must be **Given/When/Then** and **observable from outside the system**.
- At least one negative path (error / empty / boundary) per user story.
- No more than 5 user stories per spec — split if needed.
- Estimated effort in t-shirt sizes (XS/S/M/L/XL) on each story.

## Output checklist

- ✅ Personas referenced (no invented ones).
- ✅ Goals and non-goals both filled.
- ✅ Success metrics measurable in the existing analytics stack.
- ✅ Risks table with mitigations.
- ✅ Hand-off line at the end (which agent next).

## End with

```yaml
hand_off:
  next: architect | frontend-developer | …
  rationale: <one sentence>
```
