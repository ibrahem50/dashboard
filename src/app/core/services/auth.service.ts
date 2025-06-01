import { AuthInterface, AuthInterfaceResponse } from '../interfaces/auth';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Injectable, inject } from '@angular/core';

import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'jwt_token';
  private readonly tokenExpiryKey = 'jwt_expiry';
  private readonly path = 'login';

  private apiService = inject(ApiService);
  private router = inject(Router);

  private authState = new BehaviorSubject<boolean>(this.hasValidToken());
  readonly isAuthenticated$: Observable<boolean> =
    this.authState.asObservable();

  private autoLogoutTimer: any;

  constructor() {
    this.scheduleAutoLogoutFromStorage();
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const expiry = localStorage.getItem(this.tokenExpiryKey);

    if (!token || !expiry) return false;

    const isExpired = Date.now() > +expiry;
    if (isExpired) {
      this.clearToken();
      return false;
    }

    return true;
  }

  private setToken(token: string, expiresIn: number): void {
    const expiry = Date.now() + expiresIn;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tokenExpiryKey, expiry.toString());
    this.authState.next(true);
    this.scheduleAutoLogout(expiresIn);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiryKey);
    this.authState.next(false);

    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
  }

  login(data: AuthInterface) {
    return this.apiService
      .postRequest<AuthInterfaceResponse>(this.path, {
        ...data,
        expiresIn: 600000,
      })
      .pipe(
        tap((res) => {
          this.setToken(res.accessToken, res.expiresIn);
        })
      );
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  isAuthenticatedSync(): boolean {
    return this.authState.getValue();
  }

  private scheduleAutoLogout(expiresIn: number): void {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }

    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }

  private scheduleAutoLogoutFromStorage(): void {
    const expiry = localStorage.getItem(this.tokenExpiryKey);

    if (expiry) {
      const timeRemaining = +expiry - Date.now();
      if (timeRemaining > 0) {
        this.scheduleAutoLogout(timeRemaining);
      } else {
        this.clearToken();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
