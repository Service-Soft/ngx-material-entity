/**
 * This is used to have all parts of the Full-Stack used for e2e-Testing
 * in a single process. Otherwise the api or showcase project will exit
 * with a non-zero exit code which leads to the failure of github actions.
 */

/* eslint-disable no-console */

import { ChildProcess } from 'child_process';
import { spawn } from 'cross-spawn';

spawn('npm run api', [], { stdio: 'inherit' });
spawn('npm run showcase', [], { stdio: 'inherit' });
const cypress: ChildProcess = spawn('run-s waitOn:server cy:run', [], { stdio: 'inherit' });

cypress.on('close', (code: number) => {
    console.log('Cypress closed. Code:', code);
    process.exit(code);
});
cypress.on('error', () => {
    console.log('Cypress error.');
    process.exit(1);
});