import {Component} from '@angular/core';
import {AuthGoogleService} from "../../services/auth-google.service";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
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
    return this.authService.user?.firstName ?? ''
  }
}
