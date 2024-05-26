const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const envFileContent = `
  export const environment = {
    production: false,
    googleClientId: '${process.env["GOOGLE_CLIENT_ID"]}'
  };
`;

fs.writeFileSync('./src/environments/environment.ts', envFileContent);
