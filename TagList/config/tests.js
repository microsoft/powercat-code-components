/* eslint-disable */
/** Jest test setup file. */
const { configure } = require('enzyme');
const { initializeIcons } = require('@fluentui/font-icons-mdl2');
const Adapter = require('enzyme-adapter-react-16');

// Initialize icons.
initializeIcons(undefined, { disableWarnings: true });

// Configure enzyme.
configure({ adapter: new Adapter() });
