/* eslint-disable */
const path = require('path');
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        // transform files with ts-jest
        '^.+\\.(js|ts)$': 'ts-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@fluentui/react-components|@fluentui/react-icons)/)', 
      ],
    moduleNameMapper: {
    '^react/jsx-runtime$': path.join(__dirname, 'config','react-jsx-runtime.js'), 
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                // allow js in typescript
                allowJs: true,
            },
        },
    },
    snapshotSerializers: ['@fluentui/jest-serializer-merge-styles'],
    setupFiles: [path.resolve(path.join(__dirname, 'config', 'tests.js'))],
};