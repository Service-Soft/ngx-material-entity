/**
 * This is used to have all parts of the Full-Stack used for e2e-Testing
 * in a single process. Otherwise the api or showcase project will exit
 * with a non-zero exit code which leads to the failure of github actions.
 */

/* eslint-disable no-console */

import { ChildProcess, execSync } from 'child_process';
import { spawn } from 'cross-spawn';

spawn('nodemon ./api.ts', [], { stdio: 'inherit' });
spawn('ng serve ngx-material-entity-showcase', [], { stdio: 'inherit' });
execSync('wait-on http://localhost:4200');
const cypress: ChildProcess = spawn('cypress run --browser chrome', [], { stdio: 'inherit' });

cypress.on('close', (code: number) => {
    console.log('Cypress closed. Code:', code);
    process.exit(code);
});
cypress.on('error', () => {
    console.log('Cypress error.');
    process.exit(1);
});