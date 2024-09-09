import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { NotificationService } from "../services/notification-factory.service";

@Injectable({
  providedIn: 'root',
})
export class ExpiredJwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private notification: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout()
          this.notification.error('Twoja sesja wygasła, zaloguj się ponownie')
        }
        // return throwError(() => error)
        return next.handle(req)
      })
    )

  }
}