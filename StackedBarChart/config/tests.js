/* eslint-disable */
/** Jest test setup file. */
const { configure } = require('enzyme');
const { initializeIcons } = require('@fluentui/react');
const Adapter = require('enzyme-adapter-react-16');

// Initialize icons.
initializeIcons(undefined, { disableWarnings: true });

// Ensure the test snapshots are consistent when using today's date
jest.useFakeTimers('modern').setSystemTime(new Date(2022, 8, 1, 12, 0, 0));

// Configure enzyme.
configure({ adapter: new Adapter() });
