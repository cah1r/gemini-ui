import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {CreateUser} from "../model/create-user.model";
import {NgIf} from "@angular/common";
import {MessageService} from "primeng/api";
import {AuthGoogleService} from "../../services/auth-google.service";

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    NgIf
  ],
  templateUrl: './signup-modal.component.html',
  styleUrl: './signup-modal.component.css'
})
export class SignupModalComponent {
  signUpUrl = 'http://localhost:8080/api/v1/customer/createUser'
  user: CreateUser | undefined
  display: boolean = false
  signupForm: FormGroup
  @ViewChild('modalContainer') modalContainer: ElementRef | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthGoogleService
  ) {
    this.signupForm = this.fb.group({
      phoneNumber: ['', Validators.pattern(/^\d{9}$/)],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator})
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value
    const confirmPassword = form.get('confirmPassword')?.value
    return password === confirmPassword ? null : {mismatch: true}
  }

  show() {
    this.display = true
  }

  onRegister() {
    if (this.signupForm.valid) {
      this.user = {
        email: this.signupForm.get('email')?.value,
        phoneNumber: this.signupForm.get('phoneNumber')?.value,
        password: this.signupForm.get('password')?.value
      }

      this.http.post<any>(this.signUpUrl, this.user, {withCredentials: true})
        .subscribe({
          next: () => {
            this.onCancel()
            this.messageService.add(
              {
                severity: 'success',
                summary: 'Sukces',
                detail: 'Konto zostało poprawnie utworzone. Możesz się zalogować',
                life: 5000
              }
            )
          },
          error: console.error
        })
    }
  }

  onCancel() {
    this.display = false
    this.signupForm.reset()
  }

  signInWithGoogle() {
    this.authService.login()
  }

}
