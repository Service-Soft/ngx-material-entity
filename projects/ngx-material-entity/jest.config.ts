import { Config } from 'jest';

const config: Config = {
    preset: 'jest-preset-angular',
    bail: true,
    silent: false,
    setupFilesAfterEnv: ['./jest.setup.ts'],
    // coverage
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/mocks/',
        '/src/default-global-configuration-values.ts'
    ],
    collectCoverage: true,
    coverageDirectory: '../../coverage',
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 90,
            functions: 100,
            lines: 100
        }
    }
};

export default config;