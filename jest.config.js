/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/types/**/*.ts'],
    globals: {
        transform: {
            '^.+\\.tsx?$': ['ts-jest', { diagnostics: false, isolatedModules: true }],
        },
    },
}
