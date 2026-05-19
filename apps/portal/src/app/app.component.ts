/**
 * Portal root — wraps `PortalShellComponent` so the shell stays a
 * pure UI component that can be reused outside the app context (e.g. for
 * Storybook or unit tests).
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PortalShellComponent } from '@ai-studio/portal-shell';

@Component({
  selector: 'ais-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PortalShellComponent],
  template: `
    <ais-portal-shell />
  `,
})
export class AppComponent {}
