import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'tm_token';
  private readonly USER_KEY = 'tm_user';
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  signup(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Omit<AuthResponse, 'token'> | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      id: response.id,
      name: response.name,
      email: response.email
    }));
  }
}
