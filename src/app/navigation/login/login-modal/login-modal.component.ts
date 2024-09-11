import { NgIf } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { LoginService } from '../../../admin-dashboard/services/login.service';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification-factory.service';
import { LoginUser, User } from '../../../shared/model/user.model';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    InputTextModule,
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent implements OnInit {

  display: boolean = false;
  loginForm: FormGroup;
  user: LoginUser | undefined;

  constructor(
    private googleService: AuthGoogleService,
    private authService: AuthService,
    private loginService: LoginService,
    private notification: NotificationService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.loginService.onOpenModal().subscribe(isOpen => this.display = isOpen)
  }

  show() {
    this.loginService.openModal()
  }

  signInWithGoogle() {
    // this.googleService.login();
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.user = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      };
      this.sendRequest(this.user);
    }
  }

  private sendRequest(user: LoginUser) {
    this.loginService.login(user)
      .subscribe({
        next: (response: HttpResponse<User>) => {
          const authHeader = response.headers.get('authorization');
          const token = authHeader ? authHeader.split(' ')[1] : null;
          if (token) {
            this.authService.login(token);
            this.loginService.closeModal()
            this.loginForm.reset()
            this.loginService.setLoginSuccess(token)
            this.notification.success(`Zalogowano jako ${this.user?.email}`)
          } else {
            this.notification.error(`Błąd przetwarzania tokenu bezpieczeństwa. Spróbuj zalogować się ponownie`)
          }
        },
        error: () => this.notification.error(`Błąd logowania użytkownika ${this.user?.email}. Upewnij się, że email oraz hasło są poprawne.`)
      });
  }

  onCancel() {
    this.loginService.closeModal();
    this.loginForm.reset();
  }
}
