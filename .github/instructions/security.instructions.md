---
applyTo: '**'
description: Security rules — secrets, sanitisation, AI surfaces
---

# Security (Copilot scope: każdy plik)

Pełny tekst: [`.ai/rules/security.md`](../../.ai/rules/security.md).

## Sekrety

- **Nigdy** nie umieszczaj API keys / OAuth secrets / service-account JSON w source, environment files shipowanych do klienta, `.ai/`, `.github/`, commit messages, ADRs ani test fixtures.
- Sekrety lokalne żyją w `.env.local` (gitignored). Sekrety produkcyjne żyją w secret managerze platformy.
- Client-side AI calls idą przez **server-side proxy** (Cloud Function / Genkit flow).

## Obsługa wejścia

- Sanityzuj URLs przez `DomSanitizer` przed bindowaniem do `[innerHTML]`, `[src]`, `[href]`, `[style]`.
- Waliduj każdy external payload przez **Zod** na granicy. Odrzucaj zanim dotrze do stores.
- File uploads: wymuszaj MIME + size **na serwerze**.
- Formy POSTują endpoints z ochroną CSRF (handled by HTTP interceptor).

## Obsługa wyjścia

- Żadnego PII w logach. `LoggerService` redactuje emails / tokens / GUIDs.
- Generyczne user-facing error messages; detale do server log.
- Żadnych third-party `<script>` tagów. Używaj resource APIs Angulara.

## AI-specific

- Traktuj **każdy** output modelu jako untrusted text. Renderuj przez interpolację, nie `[innerHTML]`. Markdown output → sanityzuj przez `DOMPurify`.
- Tool calls mutujące state wymagają **jawnego user confirmation** w UI.
- Pliki memory i context są read-only dla agentów w production runs. Zapisy idą przez PR.

## Zależności

- `pnpm audit --prod` uruchamia się w CI. High/critical advisories blokują merge do triażu.
- Nowe zależności wymagają wpisu w [`docs/architecture/dependencies.md`](../../docs/architecture/dependencies.md).

## Kiedy triggerowane (Copilot)

Jeśli łapiesz się na pisaniu kodu, który:

- czyta `process.env.*` w pliku pod `apps/<app>/src/`,
- przypisuje do `[innerHTML]`,
- importuje `<script>` tag,
- dodaje nową dependency,

**stop i pytaj użytkownika najpierw**, cytując tę regułę.
