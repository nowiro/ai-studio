# Prompt engineering — house style

> How we write the prompts that sit under `.ai/prompts/` and inside agent role files. Aimed at humans editing them; agents read them as data.

## Principles

1. **Explicit over clever.** Ambiguity in a prompt becomes ambiguity in a PR.
2. **One outcome per prompt.** Don't bundle "design + implement + test".
3. **Schema-bound output** when downstream code parses it.
4. **Cite sources of truth.** Prompts that link rules age better than prompts that paraphrase them.
5. **Show good and bad shapes.** A counter-example saves three retries.

## Anatomy

```markdown
---
id: prompt.<slug>
title: <Human title>
type: prompt
target_agent: <role>
version: <semver>
---

# <Human title>

## Variables
- `{{NAME}}` — definition

## Task
<imperative, ≤ 5 short sentences>

## Steps
1. …
2. …

## Acceptance
- ✅ …
- ✅ …

## Output format
```yaml
…
```
```

## Patterns we like

- **Lead with the role**: "You are the X". Anchors the model.
- **Constraints up top**, examples last.
- **Quote the file path** when referring to a project file.
- **Show the YAML block** the agent is expected to emit.

## Anti-patterns

- ❌ "Be smart about it." Models don't know what we mean.
- ❌ "Use best practices" without saying which.
- ❌ Prompts that mix roles (analyst writing code, etc.).
- ❌ Magic phrases like "ultra-think" that are model-specific and don't transfer.
- ❌ Prompts that depend on the model "remembering" earlier turns.

## Updating a prompt

- Bump `version:` in the frontmatter when changing behaviour.
- Add a `## Changelog` section at the bottom for non-trivial edits.
- Add or update a fixture under `tools/scripts/__fixtures__/` so we can regression-test the prompt.

## Testing prompts

We don't have an automated eval suite yet (TODO). For now, manual smoke:

1. Run the prompt against a contrived but realistic task.
2. Check the output matches the declared format.
3. Save the result under `docs/ai-workflow/runs/<date>-<slug>.md` for posterity.
