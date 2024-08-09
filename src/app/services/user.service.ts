import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CreateGoogleUser} from "../shared/model/create-google-user";
import {API_URL} from "../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  loginWithGoogle(user: CreateGoogleUser): Observable<any> {
    return this.http.post(`${API_URL}/customer/signInWithGoogle`, user)
  }
}
