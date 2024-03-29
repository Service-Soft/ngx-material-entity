/**
 * This is used to have all parts of the Full-Stack used for e2e-Testing
 * in a single process. Otherwise the api or showcase project will exit
 * with a non-zero exit code which leads to the failure of github actions.
 */

/* eslint-disable no-console */

import { ChildProcess, exec, execSync } from 'child_process';

exec('nodemon ./api.ts');
exec('ng serve --host 0.0.0.0 ngx-material-entity-showcase');
execSync('wait-on http://0.0.0.0:4200');
const cypress: ChildProcess = exec('cypress run --browser chrome');

cypress.stdout?.on('data', (data) => {
    console.log(data);
});
cypress.on('close', (code: number) => {
    console.log('Cypress closed. Code:', code);
    process.exit(code);
});
cypress.on('error', () => {
    console.log('Cypress error.');
    process.exit(1);
});