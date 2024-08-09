import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthGoogleService} from "../../services/auth-google.service";
import {LoginUser} from "../../shared/model/login-user.model";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {LoginNavComponent} from "../login-nav/login-nav.component";
import {API_URL, MODAL_LIFE} from "../../shared/constants";

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    InputTextModule,
    NgIf,
    PaginatorModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  loginPath = '/customer/login'
  display: boolean = false
  loginForm: FormGroup
  user: LoginUser | undefined


  constructor(
    private googleService: AuthGoogleService,
    private http: HttpClient,
    private messageService: MessageService,
    private loginComponent: LoginNavComponent,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  show() {
    this.display = true
  }

  signInWithGoogle() {
    this.googleService.login()
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.user = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }

      this.http.post(API_URL + this.loginPath, this.user)
        .subscribe({
          next: () => {
            this.onCancel()
            this.loginComponent.setLoggedIn()
            this.successLoginNotification()
          },
          error: () => {
            this.failedLoginNotification()
          }
        })
    }
  }

  onCancel() {
    this.display = false
    this.loginForm.reset()
  }

  successLoginNotification() {
    this.messageService.add({
      severity: 'success',
      summary: 'Zalogowano',
      detail: `Logowanie ${this.user?.email} zakończone sukcesem`,
      life: MODAL_LIFE
    })
  }

  failedLoginNotification() {
    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail: `Błąd logowania użytkownika ${this.user?.email}.`,
      life: MODAL_LIFE
    })
  }

}
