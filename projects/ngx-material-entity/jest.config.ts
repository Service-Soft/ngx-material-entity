import { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    bail: true,
    silent: false,
    setupFilesAfterEnv: [
        './jest.setup.ts'
    ],
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