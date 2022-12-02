/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockStringProperty, MockTwoOptionsProperty, MockWholeNumberProperty } from './mock-context';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        Theme: new MockStringProperty(),
        Min: new MockWholeNumberProperty(),
        Max: new MockWholeNumberProperty(),
        Step: new MockWholeNumberProperty(),
        Label: new MockStringProperty(),
        IconName: new MockStringProperty(),
        DefaultValue: new MockStringProperty(),
        Value: new MockStringProperty(),
        Suffix: new MockStringProperty(),
        DelayOutput: new MockTwoOptionsProperty(),
        Error: new MockTwoOptionsProperty(),
        InputEvent: new MockStringProperty(),
    };
}
