/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        Theme: new MockStringProperty(),
        TextAlignment: new MockEnumProperty(),
        items: new MockDataSet([]),
        Chevron: new MockTwoOptionsProperty(),
        BackgroundColor: new MockStringProperty(),
        BorderColor: new MockStringProperty(),
    };
}
