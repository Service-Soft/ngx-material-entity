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
            branches: 100
        }
    }
};

export default config;