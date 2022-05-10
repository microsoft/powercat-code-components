/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        RenderSize: new MockEnumProperty(),
        RenderType: new MockEnumProperty(),
        SelectedKey: new MockStringProperty(),
        Theme: new MockStringProperty(),
        items: new MockDataSet([]),
    };
}
