import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { API_URL } from '../../../shared/constants';
import { CreateUser } from '../../../shared/model/user.model';
import { LoginNavComponent } from '../login-nav/login-nav.component';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    NgIf,
  ],
  templateUrl: './signup-modal.component.html',
  styleUrl: './signup-modal.component.css',
})
export class SignupModalComponent {
  createUserPath = '/user/create';
  user: CreateUser | undefined;
  display: boolean = false;
  signupForm: FormGroup;
  @ViewChild('modalContainer') modalContainer: ElementRef | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthGoogleService,
    private loginComponent: LoginNavComponent
  ) {
    this.signupForm = this.fb.group(
      {
        phoneNumber: ['', Validators.pattern(/^\d{9}$/)],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  show() {
    this.display = true;
  }

  onRegister() {
    if (this.signupForm.valid) {
      this.user = {
        email: this.signupForm.get('email')?.value,
        phoneNumber: this.signupForm.get('phoneNumber')?.value,
        // password: this.signupForm.get('password')?.value
      };

      this.http
        .post<any>(API_URL + this.createUserPath, this.user, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            this.onCancel();
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: 'Konto zostało poprawnie utworzone. Możesz się zalogować',
              life: 5000,
            });
          },
          error: console.error,
        });
    }
  }

  onCancel() {
    this.display = false;
    this.signupForm.reset();
  }

  signInWithGoogle() {
    // this.authService.login();
    // this.loginComponent.setLoggedIn()
  }
}
