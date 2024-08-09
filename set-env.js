const fs = require('fs');
const config = require('env.json');

const envFilePath = './src/environments/environment.ts'

let envFileContent = `
  export const environment = {
    production: false,
    googleClientId: '${config.googleClientId}'
  };
`;

fs.writeFileSync(envFilePath, envFileContent, {encoding: 'utf8'});
console.log('Environment file generated successfully');
