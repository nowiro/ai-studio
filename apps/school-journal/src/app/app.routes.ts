import type { Routes } from '@angular/router';

import { NotFoundComponent, roleGuard } from '@ai-studio/shared-app-shell';

/**
 * Routes for the school-journal demo. Teacher-only routes are role-gated
 * via the shared `roleGuard()` factory. The active role is read from the
 * journal's `SessionService` (wired through `AUTH_CONTEXT` in `main.ts`).
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => import('@ai-studio/journal-feature-shell').then((m) => m.DashboardComponent),
  },
  {
    path: 'timetable',
    loadComponent: async () => import('@ai-studio/journal-feature-timetable').then((m) => m.TimetablePageComponent),
  },
  {
    path: 'grades',
    loadComponent: async () => import('@ai-studio/journal-feature-grades').then((m) => m.GradesPageComponent),
  },
  {
    path: 'attendance',
    loadComponent: async () => import('@ai-studio/journal-feature-attendance').then((m) => m.AttendancePageComponent),
  },
  {
    path: 'teacher/grades',
    canMatch: [roleGuard(['teacher', 'admin'])],
    loadComponent: async () => import('@ai-studio/journal-feature-grades').then((m) => m.GradeEditorComponent),
  },
  { path: '**', component: NotFoundComponent },
];
