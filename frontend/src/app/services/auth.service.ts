import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'tm_user';

  constructor(private router: Router) {}

  signup(name: string, email: string, password: string): void {
    const user: AuthUser = { name, email };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  login(email: string, password: string): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const user: AuthUser = JSON.parse(stored);
      if (user.email === email) return true;
    }
    // Demo mode: accept any credentials
    const user: AuthUser = { name: email.split('@')[0], email };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getCurrentUser(): AuthUser | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  }
}
