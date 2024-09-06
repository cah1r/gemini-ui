import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { LoginService } from "../admin-dashboard/services/login.service";
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