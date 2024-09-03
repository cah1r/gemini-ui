import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { KeycloakService } from 'keycloak-angular';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../environments/environment';
import { CsrfInterceptor } from './security/csrf-interceptor';
import { AdminGuard } from './services/admin.guard';
import { PostRegistrationService } from './services/post-registration.service';
import { AuthInterceptorService } from './security/auth-interceptor.service';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.authority,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      loadUserProfileAtStartUp: true,
      initOptions: {
        checkLoginIframe: false,
        redirectUri: environment.keycloak.redirectUri,
      },
      enableBearerInterceptor: true,
      bearerExcludedUrls: ['/index', '/login'],
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideOAuthClient(),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    MessageService,
    ConfirmationService,
    AuthInterceptorService,
    PostRegistrationService,
    AdminGuard,
  ],
};
