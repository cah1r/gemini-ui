import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  XSRF_REGEX = /(?:^|;\s*)XSRF-TOKEN\s*=\s*([^;]*)/
  apiBaseUrl = 'http://localhost:8080/api/v1'

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const match = document.cookie.match(this.XSRF_REGEX)
    const xsrfToken = match ? match[1] : ''

    if (req.url.startsWith(this.apiBaseUrl) && xsrfToken) {
      const clonedRequest = req.clone({
        headers: req.headers.set('X-XSRF-TOKEN', xsrfToken)
      })
      return next.handle(clonedRequest)
    } else {
      return next.handle(req)
    }
  }
}
