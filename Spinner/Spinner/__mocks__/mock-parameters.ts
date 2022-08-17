/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty } from './mock-context';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        Label: new MockStringProperty(),
        SpinnerSize: new MockEnumProperty(),
        LabelPosition: new MockEnumProperty(),
    };
}
