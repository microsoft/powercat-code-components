/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockStringProperty, MockTwoOptionsProperty } from './mock-context';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        Theme: new MockStringProperty(),
        Value: new MockStringProperty(),
        Prefix: new MockStringProperty(),
        Suffix: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        ErrorMessage: new MockStringProperty(),
        Mask: new MockStringProperty(),
        MaskFormat: new MockStringProperty(),
        DelayOutput: new MockTwoOptionsProperty(),
    };
}
