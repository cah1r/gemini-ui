import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpXsrfTokenExtractor
} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsrfInterceptor implements HttpInterceptor {

  constructor(private csrfExtract: HttpXsrfTokenExtractor) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("interceptor works")
    const csrfToken = this.csrfExtract.getToken();
    if (csrfToken) {
      const clonedRequest = req.clone({
        headers: req.headers.set('X-XSRF-TOKEN', csrfToken),
        withCredentials: true
      });
      return next.handle(clonedRequest);
    }
    console.log(`extracted csrf token: ${csrfToken}`);
    return next.handle(req);
  }
}
