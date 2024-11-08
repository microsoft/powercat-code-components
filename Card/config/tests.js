/* eslint-disable @typescript-eslint/no-var-requires */
const { TextEncoder, TextDecoder } = require("util");
const { ReadableStream } = require("stream/web"); // Use Node.js stream/web for ReadableStream

// Polyfill TextEncoder, TextDecoder, and ReadableStream
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
global.ReadableStream = global.ReadableStream || ReadableStream;

const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
configure({ adapter: new Adapter() });
