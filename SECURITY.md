# Polityka bezpieczeństwa

## Zgłaszanie podatności

**Nie otwieraj publicznego issue GitHub.** Użyj [private security advisories GitHub](../../security/advisories/new).

Cele:

- Potwierdzenie w ciągu 2 dni roboczych.
- Wstępna ocena severity w ciągu 5 dni roboczych.
- Patch i responsible disclosure.

## Zakres

W zakresie:

- Kod w `apps/`, `libs/`, `tools/`.
- Pipeline'y CI/CD pod `.github/workflows/`.
- Pliki reguł AI i konfiguracje agentów pod `.ai/` i `.claude/` (np. unsafe defaulty które mogą leakować sekrety).

Poza zakresem:

- Podatności w third-party zależnościach (zgłaszaj upstream; my pobierzemy patch).
- Findings przeciw branchom innym niż `main` lub tag release'owy.
- Social engineering przeciw kontrybutorom.

## Co dołączyć

- Affected version / commit SHA.
- Kroki reprodukcji.
- Ocena impact.
- Proponowana remediation jeśli masz.

## Koordynacja

Stosujemy [coordinated vulnerability disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure). Po landowaniu fixa publikujemy security advisory creditujący zgłaszającego (chyba że woli anonimowość).

## Wspierane wersje

| Wersja | Wspierana |
| ------ | --------- |
| 0.x    | ✅        |

## Kontrole bezpieczeństwa SDLC

Następujące kontrole uruchamiają się automatycznie na każdym commit i PR:

| Kontrola                     | Kiedy                       | Tool                        |
| ---------------------------- | --------------------------- | --------------------------- |
| Secret scanning (diff)       | Każdy PR                    | Gitleaks                    |
| Secret scanning (pełne repo) | Push do main + cotygodniowo | Gitleaks                    |
| Dependency audit (high+)     | Każdy CI run + każdy PR     | `pnpm audit`                |
| CodeQL static analysis       | Push do main + cotygodniowo | GitHub CodeQL               |
| Conventional Commits         | Każdy commit + każdy PR     | commitlint + husky          |
| Token redaction w logach     | Runtime                     | `src/shared/log.ts` pattern |
| Parytet konfiguracji AI      | Każdy CI run                | `validate-ai-config.mjs`    |
| Sync trinity baseline        | Każdy CI run                | `check-trinity.mjs`         |

## Responsible Disclosure

90-dniowy timeline coordinated disclosure. Po 90 dniach od initial report (lub wcześniej za zgodą zgłaszającego) detale podatności mogą być publikowane z pełnym credit.

## Sensitive credentials — user-profile config

`ai-studio` nie przechowuje third-party credentials. Siostrzane repo MCP w trinity (`ai-mcp-alm`, `ai-mcp-devtools`) czytają wszystkie sekrety z per-user pliku poza repo:

| Platform    | Default path                                                               |
| ----------- | -------------------------------------------------------------------------- |
| **Windows** | `%USERPROFILE%\.config\nowiro\<repo>\config.json`                          |
| **macOS**   | `~/.config/nowiro/<repo>/config.json`                                      |
| **Linux**   | `$XDG_CONFIG_HOME/nowiro/<repo>/config.json` (defaults to `~/.config/...`) |

Ścieżka jest obliczana przez `os.homedir()` więc działa bez żadnego Windows-specific code branch. Priorytet resolwowania: **env var → user-profile config → throw** — nigdy default sekret. Schema per-repo: `SECURITY.md` per repo.

Jeśli `ai-studio` doda feature wymagający third-party tokena (Memory MCP cloud sync, telemetry, …), mirrorujemy ten sam pattern: gitignored `config.json`, schema w `src/shared/user-config.ts`, repo-only `config.example.json` z placeholderami.

Reguły trinity są skodyfikowane w [`.ai/rules/production-readiness.md`](.ai/rules/production-readiness.md) §1 (Permissions) i §2 (Audit logs) — oba byte-identical między trzema repo.

## Angular security checklist (v21+)

Referencja: <https://angular.dev/best-practices/security>. Stosowane między wszystkimi aplikacjami (`nowiro`, `union-vault`, `pong-game`, `individual-wizard`).

| #   | Wymaganie                                    | Status | Notatki                                                                                                                                                                                               |
| --- | -------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Najnowszy Angular                            | ✅     | v21.0.0                                                                                                                                                                                               |
| 2   | Brak customizacji Angular core               | ✅     | Wyłącznie stock distribution                                                                                                                                                                          |
| 3   | Brak API oznaczonych "Security Risk"         | ✅     | Audyt czysty                                                                                                                                                                                          |
| 4-9 | XSS / interpolation / no DOM mutation        | ✅     | Templatki używają `{{ }}`; brak `eval`/`Function`/`document.write`                                                                                                                                    |
| 7   | AOT w produkcji                              | ✅     | `@angular/build:application` default                                                                                                                                                                  |
| 10  | `bypassSecurityTrust*` audited               | ✅     | Zero użyć gdziekolwiek w `apps/` lub `libs/`                                                                                                                                                          |
| 11  | Content Security Policy                      | ✅     | Per-app `<meta http-equiv="Content-Security-Policy">` w każdym `apps/*/src/index.html`; zaostrzaj przez HTTP header w prod                                                                            |
| 12  | Unikalne CSP nonces per request              | ⏳     | Server-side concern — dodaj przy deploy                                                                                                                                                               |
| 13  | Trusted Types                                | ⏳     | Dodaj `require-trusted-types-for 'script'` do deploy-time CSP header                                                                                                                                  |
| 14  | XSRF/CSRF protection                         | ✅     | `provideHttpClient(withFetch())` w `union-vault` (cross-origin GETs only — XSRF tokens auto-suppressed). Przełącz na `withXsrfConfiguration()` gdy same-origin backend z mutating requests wystartuje |
| 15  | Non-standard XSRF cookie/header names        | N/A    | Brak same-origin backend jeszcze                                                                                                                                                                      |
| 16  | Walidacja Host headers (`allowedHosts`)      | ⏳     | Skonfiguruj przy deploy (Cloudflare Pages / Netlify rules)                                                                                                                                            |
| 17  | Trust proxy headers ostrożnie                | ⏳     | Deploy-time toggle                                                                                                                                                                                    |
| 18  | Strip XSSI prefixes                          | ✅     | `HttpClient` auto-usuwa `)]}',\n`                                                                                                                                                                     |
| 19  | Nigdy nie serwuj Angular templates z serwera | ✅     | Statyczny SPA — brak server-side templating                                                                                                                                                           |
| 20  | Audyt security-sensitive API                 | ✅     | grep czysty: brak `bypassSecurityTrust*`, brak `[innerHTML]` z user input                                                                                                                             |
| 21  | `strictTemplates: true`                      | ✅     | Wszystkie cztery aplikacje mają `tsconfig.json` z Angular strict template type-checking                                                                                                               |
| 22  | Brak dynamic template generation             | ✅     | Brak `compileTemplate` / dynamic component compilation                                                                                                                                                |
| 23  | Wyłączaj XSRF tylko gdy konieczne            | N/A    | Default XSRF zostaje włączony                                                                                                                                                                         |
| 24  | Server-side validation                       | N/A    | Brak backend w żadnej aplikacji                                                                                                                                                                       |

### Known-safe użycie `[innerHTML]`

`apps/nowiro/src/app/components/about/about.component.html` bindzie `[innerHTML]` do `t().about.p1/p2/p3`. Content jest statycznym i18n owned by repo (`<strong>` accents only), a Angular's `DomSanitizer` uruchamia się na każdym `[innerHTML]` binding (SecurityContext.HTML) — brak exploit surface.

### Per-app CSP summary

| App                 | External resources whitelisted w CSP                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `nowiro`            | + Google Fonts (Material Icons CSS + woff2). Flagi PL/GB serwowane lokalnie z `assets/flags/` — żadnego flag CDN. |
| `pong-game`         | `'self'` only + `blob:` images (Phaser canvas)                                                                    |
| `individual-wizard` | + `fonts.googleapis.com` (CSS), `fonts.gstatic.com` (woff2)                                                       |
| `union-vault`       | + Google Fonts, `cdn.jsdelivr.net` (flag-icons), `api.frankfurter.dev`, `www.floatrates.com`                      |

`'unsafe-inline'` dla `script-src`/`style-src` jest wymagane bo Angular emituje inline boot script a Material/Tailwind wstrzykują inline styles. Production deploys powinny zamienić meta CSP na HTTP header z per-request nonces (§11-12).

### Dlaczego `frame-ancestors` żyje na warstwie HTTP

`<meta http-equiv="Content-Security-Policy">` każdej aplikacji **celowo** pomija `frame-ancestors`. CSP spec wymaga że ta dyrektywa musi przyjść z HTTP response header — przeglądarki ignorują ją (i `report-uri` / `sandbox`) gdy dostarczona przez `<meta>` i emitują console warning. Ustaw na production host (Cloudflare Pages / Netlify / nginx) z:

```
Content-Security-Policy: frame-ancestors 'none'
```

Lub połącz z dyrektywami meta jako pojedynczy header dla pełnego pokrycia.

## Hardening references

- [`.ai/rules/security.md`](.ai/rules/security.md) — wewnętrzne reguły security których każdy agent przestrzega.
- [`.ai/rules/production-readiness.md`](.ai/rules/production-readiness.md) — sześć operational must-haves.
- [`.ai/architecture.md`](.ai/architecture.md) — kanoniczna referencja architektury (3 primitives, 3 warstwy, MCP power stack).
- OWASP Top 10 + OWASP LLM Top 10.
- Angular security guide: <https://angular.dev/best-practices/security>.
