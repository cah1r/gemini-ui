import {Component} from '@angular/core';
import {AuthGoogleService} from "../../services/auth-google.service";
import {NgIf} from "@angular/common";
import {SignupModalComponent} from "../signup-modal/signup-modal.component";
import {LoginModalComponent} from "../login-modal/login-modal.component";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, SignupModalComponent, ToastModule, LoginModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private loggedIn: boolean = false

  constructor(private authService: AuthGoogleService, private messageService: MessageService) {
  }

  isLoggedIn(): boolean {
    return this.loggedIn
    // return this.authService.isLoggedIn()
  }

  setLoggedIn() {
    this.loggedIn = true
  }

  logout() {
    this.authService.logout()
    this.loggedIn = false
    this.logoutNotification()
  }

  private logoutNotification() {
    this.messageService.add(
      {
        severity: 'success',
        summary: 'Sukces',
        detail: 'Zostałeś poprawnie wylogowany',
        life: 5000
      })
  }
}
