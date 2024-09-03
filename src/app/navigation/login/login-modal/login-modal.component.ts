import { NgIf } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { AuthService } from '../../../services/auth.service';
import { API_URL, MODAL_LIFE } from '../../../shared/constants';
import { LoginUser, User } from '../../../shared/model/user.model';

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
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent {
  loginPath = '/auth/login';
  display: boolean = false;
  loginForm: FormGroup;
  user: LoginUser | undefined;

  constructor(
    private googleService: AuthGoogleService,
    private authService: AuthService,
    private http: HttpClient,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  show() {
    this.display = true;
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
      this.sendHttpRequest();
    }
  }

  private sendHttpRequest() {
    this.http
      .post<User>(API_URL + this.loginPath, this.user, {
        observe: 'response',
        withCredentials: true,
      })
      .subscribe({
        next: (response: HttpResponse<User>) => {
          const authHeader = response.headers.get('authorization');
          const token = authHeader ? authHeader.split(' ')[1] : null;
          if (token) {
            this.authService.login(token);
            this.successLoginNotification();
            this.display = false;
          } else {
            this.tokenErrorNotification();
          }
        },
        error: (e) => {
          console.error(JSON.stringify(e));
          this.failedLoginNotification();
        },
      });
  }

  onCancel() {
    this.display = false;
    this.loginForm.reset();
  }

  successLoginNotification() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: `Zalogowano jako ${this.user?.email}`,
      life: MODAL_LIFE,
    });
  }

  failedLoginNotification() {
    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail: `Błąd logowania użytkownika ${this.user?.email}. Upewnij się, że email oraz hasło są poprawne.`,
      life: MODAL_LIFE,
    });
  }

  tokenErrorNotification() {
    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail: `Błąd przetwarzania tokenu bezpieczeństwa. Spróbuj zalogować się ponownie`,
      life: MODAL_LIFE,
    });
  }
}
