import { Config } from 'jest';

const config: Config = {
    preset: 'jest-preset-angular',
    bail: true,
    silent: false,
    setupFilesAfterEnv: [
        './jest.setup.ts'
    ],
    globalSetup: 'jest-preset-angular/global-setup',
    // coverage
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/mocks/'
    ],
    collectCoverage: true,
    coverageDirectory: '../../coverage',
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    }
};

export default config;