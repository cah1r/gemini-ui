import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JWT_LABEL } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean;

  constructor(private router: Router) {
    this.loggedIn = this.isTokenValid();
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem(JWT_LABEL);
    if (token) {
      const expiry = this.getTokenExpiry(token);
      if (expiry && Date.now() < expiry) {
        return true;
      } else {
        this.logout();
        return false;
      }
    }
    return false;
  }

  private getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (e) {
      return null;
    }
  }

  isAdmin() {
    const token = localStorage.getItem(JWT_LABEL);
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.role === 'ADMIN';
    }
    return false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  login(token: string) {
    localStorage.setItem(JWT_LABEL, token);
    this.loggedIn = true;
    this.router.navigate(['/index']);
  }

  logout() {
    localStorage.removeItem(JWT_LABEL);
    this.loggedIn = false;
    this.router.navigate(['/index']);
  }
}
