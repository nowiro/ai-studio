---
id: docs.projects.individual-wizard.business
title: Individual-wizard — vision and business framing
type: business-doc
status: living
date: 2026-05-18
---

# Individual-wizard — business view

## Vision

A guided 5-step onboarding wizard that collects every piece of personal data
needed for KYC / GDPR-compliant client intake — once, in one place, with
cross-field validation (PESEL ↔ date-of-birth, NIP required only for
self-employed, RODO consents driven by citizenship + education).

Pair with `business-wizard` to cover both client categories from the same
codebase:

| Client type | App                        | Key fields                              |
| ----------- | -------------------------- | --------------------------------------- |
| Individual  | `individual-wizard` (4203) | PESEL, NIP, DoB, gender, citizenship    |
| Business    | `business-wizard` (4212)   | Legal name, NIP, REGON, KRS, legal form |

The two share the same wizard mechanics (form holder pattern, status
chips, navigation, helpers) via `libs/wizard-core` — only the schema and
consent rules differ.

## Personas

| Persona        | Goal                                                       | Pain we remove                                                   |
| -------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| **Client**     | Submit personal data once, in any order                    | Linear forms that lose progress on validation errors             |
| **Operator**   | Receive structured data with valid PESEL/NIP               | Manual checksum verification of free-text fields                 |
| **Compliance** | Know which RODO consents apply per citizenship + education | Hand-curated consent lists — now driven by `consents-catalog.ts` |

## User journey

```mermaid
flowchart LR
  Start[/] --> Dashboard
  Dashboard --> Step1[Krok 1: Dane podstawowe]
  Step1 --> Step2[Krok 2: Kontakt]
  Step2 --> Step3[Krok 3: Ankieta — edukacja / zatrudnienie / języki]
  Step3 --> Step4[Krok 4: Zgody — RODO]
  Step4 --> Step5[Krok 5: Podsumowanie + PDF]
  Dashboard -.->|deep link| Step3
```

Steps are non-linear — the dashboard lets the user jump into any step
directly. Validation only blocks the final submit, not navigation.

## What the user sees per step

| #   | Step            | Key fields                                                                                                                                   | Conditional logic                                                                                 |
| --- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Dane podstawowe | Imię, nazwisko, PESEL, NIP, data urodzenia, płeć, obywatelstwo                                                                               | Citizenship=PL → PESEL required; PESEL valid → auto-fill DoB+gender; self-employed → NIP required |
| 2   | Kontakt         | Email, dynamic phone array, dynamic address array (residence/mailing/invoice)                                                                | Cross-validator: at least one address with `purpose: residence`                                   |
| 3   | Ankieta         | Wykształcenie (primary/secondary/higher/phd) z zagnieżdżeniami: studia → kierunek → specjalizacja IT → praca dyplomowa; zatrudnienie; języki | Conditional sub-groups added/removed by valueChanges                                              |
| 4   | Zgody           | RODO, marketing, profilowanie — generowane wg kontekstu                                                                                      | Citizenship + residence-country + education-level drive the catalog                               |
| 5   | Podsumowanie    | JSON snapshot, accept-terms, PDF export                                                                                                      | Submit gated on `form.valid && acceptTerms`. PDF generated via `wizard-util-pdf`.                 |

## Out of scope (for now)

- Backend POST + persistence
- Multi-language UI — Polish only
- Web Component build (planned in Phase 1 of consolidated roadmap)
