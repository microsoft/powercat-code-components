/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        Theme: new MockStringProperty(),
        items: new MockDataSet([]),
        ApplyDarkTheme: new MockTwoOptionsProperty(),
        WizardCompleteorError: new MockEnumProperty(),
        StepsSchema: new MockStringProperty(),
        ShowAnimation: new MockTwoOptionsProperty(),
    };
}
