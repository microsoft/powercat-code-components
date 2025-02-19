/** @type {import('ts-jest').JestConfigWithTsJest} **/
/* eslint-disable */
const path = require('path');
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    "^.+.tsx?$": ["ts-jest", {}],
    '^.+\\.(js|ts)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!(@fluentui/react-components|@fluentui/react-icons|@react-hook)/)'
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
    // moduleNameMapper: {
    // '^react/jsx-runtime$': path.join(__dirname, 'config','react-jsx-runtime.js'), 
    //},
    //setupFiles: [path.resolve(path.join(__dirname, 'config', 'tests.js'))],
    //snapshotSerializers: ['@fluentui/jest-serializer-merge-styles']
  }
};