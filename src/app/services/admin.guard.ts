import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isLoggedIn() && this.authService.isAdmin();
  }
}
