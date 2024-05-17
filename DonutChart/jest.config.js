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
    transformIgnorePatterns: [
        '/node_modules/(?!(@fluentui|d3-scale|d3-interpolate|d3-array|d3-format|d3-time-format|d3-color|d3-shape|d3-axis|d3-brush|d3-chord|d3-collection|d3-dispatch|d3-drag|d3-dsv|d3-ease|d3-fetch|d3-force|d3-geo|d3-hierarchy|d3-path|d3-polygon|d3-quadtree|d3-random|d3-request|d3-selection|d3-time|d3-timer|d3-transition|d3-voronoi|d3-zoom)/)',
      ],
    snapshotSerializers: ['@fluentui/jest-serializer-merge-styles'],
    setupFiles: [path.resolve(path.join(__dirname, 'config', 'tests.js'))],
};