/**
 * Vitest setup — loads the Angular JIT compiler so that partial-compiled
 * libraries (`@angular/core`, `@angular/common`) resolve their declare-style
 * factories in a non-Angular bundler runtime.
 */
import '@angular/compiler';
