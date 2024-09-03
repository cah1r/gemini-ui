import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { API_URL } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class PostRegistrationService {
  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient
  ) {
    this.initializeUserProfile();
  }

  initializeUserProfile() {
    if (this.keycloakService.isLoggedIn()) {
      this.fetchUserProfile();
    } else {
      this.keycloakService.login().then(() => this.fetchUserProfile());
    }
  }

  fetchUserProfile() {
    this.keycloakService
      .loadUserProfile()
      .then((profile: KeycloakUserProfile) => {
        const userData = {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.attributes?.['phoneNumber']
            ? profile.attributes.phoneNumber[0]
            : undefined,
        };
        console.log('fetched user data: ' + userData);
        this.sendUserData(userData);
      });
  }

  sendUserData(userData: any) {
    console.log('sending user data: ' + userData);
    this.http.post(API_URL + '/user/sign-in', userData).subscribe({
      next: () => console.log('User data sent to backend'),
      error: (e) => console.error('Error sending user data to backend', e),
    });
  }
}

interface KeycloakUserProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
  attributes?: {
    phoneNumber?: number[];
  };
}
