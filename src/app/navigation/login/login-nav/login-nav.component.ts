import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth.service';
import { MODAL_LIFE } from '../../../shared/constants';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { SignupModalComponent } from '../signup-modal/signup-modal.component';
import { NotificationService } from '../../../services/notification-factory.service';

@Component({
  selector: 'app-login-nav',
  standalone: true,
  imports: [
    Button,
    LoginModalComponent,
    NgClass,
    NgIf,
    SignupModalComponent,
    ToastModule,
  ],
  templateUrl: './login-nav.component.html',
  styleUrl: './login-nav.component.css',
})
export class LoginNavComponent {
  showLoginModal = false;

  constructor(
    private readonly authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.isLoggedIn();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.notification.success('Zostałeś poprawnie wylogowany');
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  showAdminDash() {
    this.router.navigate(['admin']);
  }

}
