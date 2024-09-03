import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { NotificationService } from '../../../services/notification-factory.service';
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

  user: CreateUser | undefined;
  display: boolean = false;
  signupForm: FormGroup;
  @ViewChild('modalContainer') modalContainer: ElementRef | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notification: NotificationService,
    private authService: AuthGoogleService,
    private loginComponent: LoginNavComponent
  ) {
    this.signupForm = this.fb.group(
      {
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$')]],
        lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$')]],
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
        firstName: this.signupForm.get('firstName')?.value,
        lastName: this.signupForm.get('lastName')?.value,
        password: this.signupForm.get('password')?.value,
      };

      this.http
        .post<any>(API_URL + '/auth/signup', this.user, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            this.onCancel();
            this.notification.success('Konto zostało poprawnie utworzone. Możesz się zalogować')
          },
          error: (error) => {
            if (error.status === 409) {
              this.notification.error('Użytkownik o podanym adresie e-mail już istnieje')
            } else {
              this.notification.error('Wystąpił błąd podczas tworzenia konta. Spróbuj ponownie później')
            }
          }
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
