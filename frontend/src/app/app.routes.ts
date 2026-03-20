import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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
  { path: '**', redirectTo: 'login' }
];
