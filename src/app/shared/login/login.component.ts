import {Component} from '@angular/core';
import {AuthGoogleService} from "../../services/auth-google.service";
import {NgIf} from "@angular/common";
import {SignupModalComponent} from "../signup-modal/signup-modal.component";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, SignupModalComponent, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthGoogleService, private messageService: MessageService) {
  }

  signInWithGoogle() {
    this.authService.login()
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }

  logout() {
    this.authService.logout()
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
