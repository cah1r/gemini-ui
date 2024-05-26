import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../shared/model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/v1/customer'

  constructor(private http: HttpClient) { }

  loginWithGoogle(user : User): Observable<any> {
    const endpoint = `${this.apiUrl}/createGoogleUser`
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<any>(endpoint, user, { headers })
  }
}
