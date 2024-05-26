import {Component, inject} from '@angular/core';
import {AuthGoogleService} from "../../services/auth-google.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NgIf} from "@angular/common";

const MODULES: any[] = [MatFormFieldModule, FormsModule, ReactiveFormsModule];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MODULES, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthGoogleService) {}

  signInWithGoogle() {
    this.authService.login()
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }

  logout() {
    this.authService.logout()
  }

  getName() {
    return this.authService.user?.firstName
  }
}
