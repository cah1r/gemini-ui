import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {CreateUser} from "../shared/model/create-user.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:8080/api/v1'

  constructor(private http: HttpClient) {}

  loginWithGoogle(user: CreateUser | undefined): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/signInWithGoogle`, user)
  }
}
