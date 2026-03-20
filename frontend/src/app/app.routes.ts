import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/tasks-page/tasks-page.component').then(m => m.TasksPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./pages/overview-page/overview-page.component').then(m => m.OverviewPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'progress',
    loadComponent: () =>
      import('./pages/progress-page/progress-page.component').then(m => m.ProgressPageComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
