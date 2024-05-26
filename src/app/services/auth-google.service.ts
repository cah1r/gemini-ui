import {Injectable} from '@angular/core';
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";
import {UserService} from "./user.service"
import {User} from "../shared/model/user.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  user: User | undefined

  constructor(private oAuthService: OAuthService, private userService: UserService) {
    this.initConfiguration()
    this.subscribeForUserData()
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: environment.googleClientId,
      redirectUri: window.location.origin,
      scope: 'openid email profile'
    }

    this.oAuthService.configure(authConfig)
    this.oAuthService.setupAutomaticSilentRefresh()
    this.oAuthService.loadDiscoveryDocumentAndTryLogin()
  }

  subscribeForUserData() {
    this.oAuthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        console.log('token received')
        const profile = this.getProfile()
        this.user = {
          firstName: profile['given_name'],
          lastName: profile['family_name'],
          email: profile['email']
        }
        this.userService.loginWithGoogle(this.user).subscribe(response =>
          console.log(`got response from backend: ${response.toString()}`)
        )
      }
    })
  }

  login() {
    this.oAuthService.initImplicitFlow()
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout()
    this.oAuthService.logOut()
  }

  getProfile() {
    return this.oAuthService.getIdentityClaims()
  }

  getToken() {
    return this.oAuthService.getAccessToken()
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }
}
