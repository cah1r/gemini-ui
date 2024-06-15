import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi} from '@angular/common/http';
import {provideOAuthClient} from 'angular-oauth2-oidc';
import {CsrfInterceptor} from "./csrf-interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideOAuthClient(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true
    },
  ]
};
