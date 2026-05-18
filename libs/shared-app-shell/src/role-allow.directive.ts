import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AUTH_CONTEXT } from './auth-context.js';

/**
 * Structural directive that renders the host template only when the current
 * member's role is in the allowed list. Hides the UI when no member is
 * signed in. Generic across all apps — the role string contract is opaque.
 *
 * Usage:
 * ```html
 * <a *aisRoleAllow="['librarian']" routerLink="/admin">Admin</a>
 * ```
 */
@Directive({
  selector: '[aisRoleAllow]',
})
export class RoleAllowDirective {
  private readonly auth = inject(AUTH_CONTEXT);
  private readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  readonly aisRoleAllow = input.required<readonly string[]>();

  private rendered = false;

  constructor() {
    effect(() => {
      const role = this.auth.role();
      const allowed = this.aisRoleAllow();
      const visible = role !== null && allowed.includes(role);
      if (visible && !this.rendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      } else if (!visible && this.rendered) {
        this.viewContainer.clear();
        this.rendered = false;
      }
    });
  }
}
