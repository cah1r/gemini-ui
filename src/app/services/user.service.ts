import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../shared/model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:8080/api/v1/customer'

  constructor(private http: HttpClient) { }

  loginWithGoogle(user: User): Observable<any> {
    const endpoint = `${this.apiUrl}/createGoogleUser`
    return this.http.post<any>(endpoint, user, {withCredentials: true})
  }
}
