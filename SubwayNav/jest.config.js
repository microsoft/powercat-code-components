/* eslint-disable */
const path = require('path');
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        // transform files with ts-jest
        '^.+\\.(js|ts)$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                // allow js in typescript
                allowJs: true,
            },
        },
    },
    coveragePathIgnorePatterns: ['SubwayNav/utilities'],
    setupFiles: [path.resolve(path.join(__dirname, 'config', 'tests.js'))],
};
