/**
 * This is used to have all parts of the Full-Stack used for e2e-Testing
 * in a single process. Otherwise the api or showcase project will exit
 * with a non-zero exit code which leads to the failure of github actions.
 */

/* eslint-disable no-console */

import { ChildProcess, exec } from 'child_process';
import { spawn } from 'cross-spawn';

exec('npm run api');
exec('npm run showcase');
const cypress: ChildProcess = spawn('run-s waitOn:server cy:run', [], { stdio: 'inherit' }) as ChildProcess;

cypress.on('close', (code: number) => {
    console.log('Cypress closed. Code:', code);
    process.exit(code);
});
cypress.on('error', () => {
    console.log('Cypress error.');
    process.exit(1);
});