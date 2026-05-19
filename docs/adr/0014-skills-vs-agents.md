# 0014 — Skills vs Agents — kiedy używać każdego prymitywu

- Status: proposed
- Date: 2026-05-19
- Decision-makers: maintainers
- Consulted: AI working group
- Informed: all contributors

## Context and problem statement

Po dołożeniu 8 skilli do `.claude/skills/` (PLAN.md krok 1) repo ma teraz trzy warstwy treści dla agentów AI:

1. **Reguły** (`.ai/rules/*.md`) — twarde "nie wolno / należy" non-negotiable.
2. **Agenci** (`.ai/agents/*.md` mirrowane w `.claude/agents/`) — personas + decyzje + delegacje.
3. **Skille** (`.claude/skills/<name>/SKILL.md`) — playbooki on-demand.

Bez jasnego kryterium contributorzy będą duplikować treść (np. `angular-testing` skill kopiujący 80% z `.ai/rules/testing.md`) albo lokować patterny w niewłaściwej warstwie.

Patrz też [`.ai/architecture.md`](../../.ai/architecture.md) §1 — trzy primitives: Tool · MCP · Skill.

## Decision drivers

- DRY — każda zasada żyje w jednym miejscu.
- LLM-readability — agent musi wiedzieć, gdzie szukać.
- Testowalność — reguły są walidowane przez CI, skille przez `ai:validate`.
- Boring tech — markdown + frontmatter, bez nowych formatów.

## Considered options

1. **Skille kopiują reguły** — autonomiczne, ale duplikują treść.
2. **Skille linkują reguły** — krótsze, źródło prawdy zostaje w `.ai/rules/`.
3. **Tylko reguły, bez skilli** — jak teraz przed PLAN.md.

## Decision outcome

Wybieramy **opcję 2**: skille są **playbookami**, które linkują do reguł jako źródła prawdy. Wzorzec ustanowiony przez `angular-material-design/SKILL.md` (linkuje do `.ai/rules/styling.md`).

### Kryteria wyboru warstwy

| Treść                                 | Warstwa                | Powód                               |
| ------------------------------------- | ---------------------- | ----------------------------------- |
| "Nie wolno X" / "Każdy PR musi Y"     | `.ai/rules/`           | Hard constraints, mierzone przez CI |
| "Persona Z decyduje co i kiedy"       | `.ai/agents/`          | Decyzyjność + delegacje             |
| "Jak zaimplementować X krok po kroku" | `.claude/skills/`      | Recepta z kodem, on-demand          |
| "Dlaczego X zamiast Y"                | `docs/adr/`            | Decyzja architektoniczna            |
| "Konkretny case study"                | `docs/projects/<app>/` | Per-projekt narracja                |

### Consequences

- ➕ Każda informacja ma jedno miejsce kanoniczne.
- ➕ Skille są krótsze (200-400 linii vs. 600+) — szybsze do załadowania.
- ➕ Walidacja `pnpm ai:validate` może sprawdzić, że każdy skill linkuje do co najmniej jednej reguły.
- ➖ Skill bez kontekstu reguły jest mniej użyteczny — agent musi załadować obie.
- ➖ Trinity sync musi obejmować obie warstwy.

## Implementation plan

- [x] 8 skilli w `.claude/skills/` (PLAN.md krok 1).
- [x] Wzorzec linkowania w `angular-material-design/SKILL.md`.
- [ ] Walidator `tools/scripts/validate-ai-config.mjs` egzekwuje wymaganie linku w każdym `SKILL.md` (TD-005).
- [ ] Trinity:check rozszerzony o weryfikację skilli (PLAN.md krok 12).

## References

- [`.ai/architecture.md`](../../.ai/architecture.md) §1
- [`.claude/skills/angular-material-design/SKILL.md`](../../.claude/skills/angular-material-design/SKILL.md)
- [`PLAN.md`](../../PLAN.md) Faza 1
