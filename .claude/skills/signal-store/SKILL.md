---
name: signal-store
description: |
  Signal-based state management patterns for AI Studio. Use whenever you decide between
  `signal()` + `computed()` (lightweight component state) and NgRx SignalStore (shared
  domain state); whenever you write a `*-store.ts` in `libs/<x>-data/`; whenever you reach
  for Angular 21's `linkedSignal()` or `resource()`; or whenever an `effect()` causes an
  infinite loop. Covers state-shape patterns, `withState` / `withMethods` / `withComputed`
  composition, idiomatic `update(s => ({...s, ...patch}))`, the `linkedSignal` recipe,
  `resource()` for async data, and the demo-app exemplars. Linked to `.ai/rules/angular.md`
  §2 (canonical state rules).
---

# Signal store patterns (AI Studio)

> Reach for this skill whenever you need to share state across components. For pure UI state
> inside a single component, plain `signal()` + `computed()` is enough — see
> [`.ai/rules/angular.md`](../../.ai/rules/angular.md) §2.
>
> Stack: Angular 21 signals (`signal`, `computed`, `effect`, `linkedSignal`, `resource`),
> optionally NgRx SignalStore (`@ngrx/signals`) for domain state with composable features.

## 1. Decision matrix — when to scale up

| Need                                                      | Use                                                             |
| --------------------------------------------------------- | --------------------------------------------------------------- |
| Local UI state in one component (modal open, tab index)   | `signal()` in the class                                         |
| Derived data from inputs/signals                          | `computed()`                                                    |
| One-off side-effect (DOM, localStorage, analytics)        | `effect()` (with cleanup if needed)                             |
| Shared state across siblings/route children               | `@Injectable({ providedIn: 'root' })` service that owns signals |
| Domain state with > 5 mutations & cross-cutting computeds | **NgRx SignalStore** with features                              |
| Async list/detail fetch                                   | `resource()` or `httpResource()`                                |
| Bidirectional sync with a single parent signal            | `linkedSignal()`                                                |

The decision cliff: when your "signal service" has > 5 setters and computeds you re-derive
in components, you've outgrown plain signals — promote to SignalStore.

## 2. Plain signals — local UI state

```ts
@Component({
  /* ... */
})
export class FilterBar {
  protected readonly query = signal('');
  protected readonly selectedGenre = signal<Genre | null>(null);

  protected readonly hasFilters = computed(
    () => this.query().length > 0 || this.selectedGenre() !== null,
  );

  protected reset(): void {
    this.query.set('');
    this.selectedGenre.set(null);
  }
}
```

Rule: any state read by the template lives on the component (or an injected store). No
state in field initialisers that escapes the class.

## 3. Service-based store — shared across siblings

```ts
// libs/library-data/src/lib/catalogue-store.ts
@Injectable({ providedIn: 'root' })
export class CatalogueStore {
  private readonly state = signal<{
    books: readonly Book[];
    query: string;
    genre: Genre | null;
  }>({ books: [], query: '', genre: null });

  readonly books = computed(() => this.state().books);
  readonly query = computed(() => this.state().query);
  readonly filtered = computed(() => {
    const { books, query, genre } = this.state();
    return books.filter(
      (b) =>
        (query === '' || b.title.toLowerCase().includes(query.toLowerCase())) &&
        (genre === null || b.genre === genre),
    );
  });

  setQuery(q: string): void {
    this.state.update((s) => ({ ...s, query: q }));
  }
  setGenre(g: Genre | null): void {
    this.state.update((s) => ({ ...s, genre: g }));
  }
  setBooks(books: readonly Book[]): void {
    this.state.update((s) => ({ ...s, books }));
  }
}
```

Idioms:

- **Single source of truth** — one private `state` signal holding the whole shape.
- **Public computeds** — components read derived signals, never internal state.
- **Setters update by patch** — `s.update(s => ({ ...s, ...patch }))`. Never `s.set(...)` with a partial.

## 4. NgRx SignalStore — domain state

When the store has > 5 mutations and you want composable "features" (CRUD helpers, persistence,
devtools), reach for SignalStore.

```ts
import { computed, inject } from '@angular/core';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

interface LoanState {
  loans: readonly Loan[];
  loading: boolean;
  filter: 'all' | 'overdue' | 'returned';
}

const initialState: LoanState = { loans: [], loading: false, filter: 'all' };

export const LoanStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ loans, filter }) => ({
    visible: computed(() => {
      const f = filter();
      const all = loans();
      if (f === 'overdue') return all.filter((l) => l.dueDate < new Date());
      if (f === 'returned') return all.filter((l) => l.returnedAt !== null);
      return all;
    }),
    overdueCount: computed(
      () => loans().filter((l) => l.dueDate < new Date() && !l.returnedAt).length,
    ),
  })),
  withMethods((store, api = inject(LoanApi)) => ({
    async load(): Promise<void> {
      patchState(store, { loading: true });
      const loans = await api.list();
      patchState(store, { loans, loading: false });
    },
    setFilter(filter: LoanState['filter']): void {
      patchState(store, { filter });
    },
    async markReturned(loanId: string): Promise<void> {
      await api.markReturned(loanId);
      patchState(store, (s) => ({
        loans: s.loans.map((l) => (l.id === loanId ? { ...l, returnedAt: new Date() } : l)),
      }));
    },
  })),
);
```

Inject like any service:

```ts
@Component({
  /* ... */
})
export class LibrarianPanel {
  protected readonly store = inject(LoanStore);

  ngOnInit(): void {
    void this.store.load();
  }
}
```

## 5. `patchState` — three idioms

```ts
// 1. Shallow merge with new value
patchState(store, { loading: true });

// 2. Functional update — when new state depends on old
patchState(store, (s) => ({ count: s.count + 1 }));

// 3. Multiple slices in one call
patchState(store, { loading: false }, (s) => ({ items: [...s.items, newItem] }));
```

Never mutate `s` inside the updater — return a new object. Arrays / nested objects must be
spread / mapped, not pushed in place.

## 6. `linkedSignal()` — bidirectional binding

Angular 21 ships `linkedSignal()` for cases where a child needs to mirror a parent signal but
also accept overrides (e.g. a filter that defaults to the URL but can be edited).

```ts
import { linkedSignal } from '@angular/core';

protected readonly routeQuery = inject(ActivatedRoute).queryParamMap;
protected readonly query = linkedSignal({
  source: () => this.routeQuery().get('q') ?? '',
  computation: (source) => source,
});

// Reads as routeQuery by default, but `query.set('manual')` overrides until source changes.
```

Use sparingly — it's powerful but the "what wins when both change" semantics confuse readers.
Add a comment when you reach for it.

## 7. `resource()` / `httpResource()` — async data

Angular 21's `resource()` replaces hand-rolled `loading`/`error`/`value` triples.

```ts
import { resource } from '@angular/core';

protected readonly bookId = signal<string>('');
protected readonly book = resource({
  request: this.bookId,
  loader: async ({ request }) => {
    const res = await fetch(`/api/books/${request}`);
    if (!res.ok) throw new Error(res.statusText);
    return (await res.json()) as Book;
  },
});

// Template
@if (book.hasValue()) {
  <ais-book-detail [book]="book.value()" />
}
@if (book.isLoading()) {
  <mat-progress-spinner />
}
@if (book.error()) {
  <p class="banner-error">{{ book.error() }}</p>
}
```

For HTTP specifically, prefer `httpResource()` (from `@angular/common/http`) — it composes with
`HttpClient` interceptors and supports cancellation natively.

## 8. `effect()` — only for non-Angular sync

```ts
import { effect } from '@angular/core';

constructor() {
  effect(() => {
    const theme = this.theme();
    document.documentElement.dataset['theme'] = theme;
  });
}
```

Rules ([`.ai/rules/angular.md`](../../.ai/rules/angular.md) §2):

- Never call setters of signals inside `effect()` that re-trigger the same effect.
- Reach for `effect()` only when **non-Angular** code (DOM, IndexedDB, WebSocket) needs to
  observe a signal.
- For setter-style work (debounce, persistence), prefer a computed + listener pattern or
  a dedicated `withMethods` action.

### Cleanup

```ts
effect((onCleanup) => {
  const sub = source.subscribe(...);
  onCleanup(() => sub.unsubscribe());
});
```

## 9. Persistence pattern

```ts
const DRAFT_KEY = 'wizard.draft';

@Injectable({ providedIn: 'root' })
export class WizardStore {
  readonly draft = signal<WizardDraft | null>(
    JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null') as WizardDraft | null,
  );

  saveDraft(draft: WizardDraft): void {
    this.draft.set(draft);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  clearDraft(): void {
    this.draft.set(null);
    localStorage.removeItem(DRAFT_KEY);
  }
}
```

Persistence is a side-effect; the setter does the localStorage write so it stays explicit
and testable. Don't hide it in an `effect()` that fires on every keystroke.

## 10. Anti-patterns

- `signal<any>()` — always parameterise. Untyped signals lose autocomplete and let bad data in.
- Multiple top-level signals where one shape would do (`books`, `query`, `genre` as separate
  signals instead of one `state` signal).
- Calling `.mutate()` — gone in v21. Use `.update(s => ({...s, ...patch}))`.
- `effect()` that sets the signal it reads — infinite loop.
- Computeds that allocate large arrays without memoising (e.g. nested `.filter().map().sort()`
  on every read). Wrap in `computed`, not a function.
- Exposing `state` directly from a SignalStore. Always expose computeds.
- Reaching into another store from inside `withComputed` — services should depend on services
  via `inject()`, not via signal cross-reads.
- `patchState(store, ...)` from outside the store. Mutations live in `withMethods`.

## 11. Quick state-author checklist

Before reporting done:

- [ ] State shape declared as a single object signal (not N parallel signals)?
- [ ] Every mutation typed (no `any`, no `as unknown as`)?
- [ ] Public reads are `computed()` (or via SignalStore selectors); private `state` not leaked?
- [ ] Setters use `.update(s => ({...s, ...patch}))` (immutable)?
- [ ] `effect()` only for non-Angular side-effects, with `onCleanup` if needed?
- [ ] Async data uses `resource()` / `httpResource()` where it fits?
- [ ] Unit tests assert behaviour through the public API (no `(store as any)._state`)?
- [ ] If using SignalStore: features composed with `withState/withMethods/withComputed`?

## 12. When to add NgRx SignalStore (vs plain service)

Move to SignalStore when **at least two** apply:

- Store has > 5 mutations.
- Multiple computeds depend on the same internal state.
- You want devtools (`withDevtools` feature).
- You want auto-injection of dependencies via the `withMethods((store, api = inject(Api))) => ...` idiom.
- The store is composed across libs (e.g. base `EntityStore` reused by `BooksStore`, `MoviesStore`).

For < 5 mutations and a single consumer, plain `signal()` in a service is enough.

---

_Reference implementations: `libs/library-data/src/lib/loan-store.ts` (SignalStore),
`libs/individual-wizard-data/src/lib/wizard-store.ts` (plain service signals),
`libs/tire-shop-data/src/lib/cart-store.ts` (mixed — service + computed signals)._
