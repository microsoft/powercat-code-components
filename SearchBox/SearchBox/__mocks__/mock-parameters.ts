/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockStringProperty, MockTwoOptionsProperty } from './mock-context';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        Underlined: new MockTwoOptionsProperty(),
        PlaceHolderText: new MockStringProperty(),
        IconName: new MockStringProperty(),
        DisableAnimation: new MockTwoOptionsProperty(),
        InputEvent: new MockStringProperty(),
        DelayOutput: new MockTwoOptionsProperty(),
        SearchText: new MockStringProperty(),
        BorderColor: new MockStringProperty(),
    };
}
