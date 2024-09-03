export const environment = {
  production: false,
  googleClientId:
    '868548605209-vsdjiorj7aq982h4e9nn6i95a08ntarn.apps.googleusercontent.com',
  keycloak: {
    authority: 'http://localhost:8081',
    redirectUri: 'http://localhost:4200/post-sign-in',
    postLogoutRedirectUri: 'http://localhost:4200',
    realm: 'gemini_users',
    clientId: 'gemini-ui',
  },
  idleConfig: { idle: 10, timeout: 60, ping: 10 },
};
