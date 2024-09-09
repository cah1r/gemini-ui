import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  XSRF_REGEX = /(?:^|;\s*)XSRF-TOKEN\s*=\s*([^;]*)/;
  apiBaseUrl = 'http://localhost:8080/api/v1';

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const match = this.XSRF_REGEX.exec(document.cookie)
    const xsrfToken = match ? match[1] : '';

    if (req.url.startsWith(this.apiBaseUrl) && xsrfToken != '') {
      const clonedRequest = req.clone({
        headers: req.headers.set('X-XSRF-TOKEN', xsrfToken),
        withCredentials: true,
      });
      return next.handle(clonedRequest);
    } else {
      return next.handle(req);
    }
  }
}
