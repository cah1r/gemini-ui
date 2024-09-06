import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../shared/constants';
import { LoginUser, User } from '../../shared/model/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private modalOpen = new BehaviorSubject<boolean>(false)
  private _loginSuccess = new BehaviorSubject<string | null>(null)

  constructor(private http: HttpClient) { }

  login(user: LoginUser) {
    return this.http.post<User>(API_URL + '/auth/login', user, {
      observe: 'response'
    })
  }

  setLoginSuccess(token: string) {
    this._loginSuccess.next(token)
  }

  onLoginSuccess(): Observable<string | null> {
    return this._loginSuccess.asObservable()
  }

  onOpenModal(): Observable<boolean> {
    return this.modalOpen.asObservable()
  }

  openModal() {
    this.modalOpen.next(true)
  }

  closeModal() {
    this.modalOpen.next(false)
  }

  get isLoginModalOpen(): boolean {
    return this.modalOpen.getValue()
  }
}
