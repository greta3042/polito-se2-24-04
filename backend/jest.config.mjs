export default {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/test_unit/**/*.test.mjs'],
    reporters: ["default"],
    testTimeout: 60000,
    clearMocks: true,
    transform: {
        '^.+\\.mjs$': 'babel-jest',
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};