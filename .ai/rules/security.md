---
id: rules.security
title: Reguły security
type: rules
scope: security
priority: 1
version: 2.0.0
---

# Reguły security

## 1. Sekrety

- **Nigdy** nie umieszczaj API keys, OAuth secrets ani service account JSON w:
  - source code (`*.ts`, `*.html`, `*.scss`),
  - plikach environment shipowanych do klienta (`environments/*.ts`),
  - konfiguracji `.ai/` lub `.claude/`,
  - commit messages, opisach PR, ADR,
  - test fixtures.
- Sekrety lokalne żyją w `.env.local` (gitignored).
- Sekrety produkcyjne żyją w secret managerze platformy (Firebase secrets, AWS SM, GCP Secret Manager, …).
- Client-side AI calls **muszą** iść przez server-side proxy (Cloud Function / Genkit flow), który trzyma klucz.

## 2. Obsługa wejścia

- Sanityzuj każdy URL przez `DomSanitizer` zanim przekażesz do `[innerHTML]`, `[src]`, `[href]`, `[style]`.
- Waliduj każdy external payload schemą (Zod / Valibot). Odrzucaj zanim dotrze do store.
- File uploads: wymuszaj MIME + size na serwerze; client checks są tylko UX-owe.
- Wszystkie formy postują do endpointów wymagających ochrony CSRF (obsługa w HTTP interceptor).

## 3. Obsługa wyjścia

- Żadnego PII w logach. `LoggerService` redactuje emails, tokens, GUIDs domyślnie.
- Komunikaty błędów pokazywane użytkownikowi są generyczne; detale idą do server log.
- Żadnych third-party scriptów przez `<script>`. Używaj resource APIs Angulara.

## 4. AI-specific

- Traktuj **każdy** output modelu jako untrusted text:
  - Renderuj przez `[textContent]` / interpolation, nie `[innerHTML]`.
  - Jeśli output ma być renderowany jako Markdown, sanityzuj przez `DOMPurify` najpierw.
- Tool calls triggerowane przez LLM, które mutują stan, wymagają **jawnego user confirmation** w UI.
- Pliki memory i context są read-only dla agentów w production runs. Zapisy idą przez PRy.

## 5. Zależności

- `pnpm audit --prod` uruchamia się w CI; high/critical advisories blokują merge do triażu.
- Nowe zależności wymagają wpisu w `docs/architecture/dependencies.md` (czemu ta lib, alternatywy considered).
- Lock peer ranges w `package.json`; renovate/dependabot proponuje aktualizacje.

## 6. Auth flows (gdy dodane)

- Używaj OIDC + PKCE; nigdy deprecated implicit flow.
- Tokeny przechowywane w **httpOnly, SameSite=Strict** cookies — nie `localStorage`.
- Logout invaliduje server-side; klient po prostu odrzuca.

## 7. CSP

- Production responses serwują ścisły Content-Security-Policy: `default-src 'self'; script-src 'self'; ...`.
- Żadnego `'unsafe-inline'`. Używaj `provideCSPNonce` Angulara lub hash-based CSP.

## 8. Zgłaszanie

- Podejrzewana podatność → instrukcje z `SECURITY.md` (private disclosure).
- Agent `security-auditor` uruchamia się przeciw każdemu PR dotykającemu auth, sanityzacji, zależności lub CSP.
