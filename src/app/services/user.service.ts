import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../shared/model/user.model";
import {CsrfInterceptor} from "../csrf-interceptor";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  XSRF_REGEX = /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/
  apiUrl = 'http://localhost:8080/api/v1'

  csrfToken: string

  constructor(private http: HttpClient, private csrfInterceptor: CsrfInterceptor) {
    this.csrfToken = document.cookie.replace(this.XSRF_REGEX, '$1');
  }

  loginWithGoogle(user: User): Observable<any> {
    const endpoint = `${this.apiUrl}/customer/createGoogleUser`
    const headers = new HttpHeaders({'X-XSRF-TOKEN': this.csrfToken})
    return this.http.post<any>(endpoint, user, { headers: headers, withCredentials: true })
  }

}
