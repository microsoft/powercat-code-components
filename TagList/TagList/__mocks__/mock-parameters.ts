/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockWholeNumberProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        BorderRadius: new MockWholeNumberProperty(),
        SelectedKey: new MockStringProperty(),
        Theme: new MockStringProperty(),
        TextAlignment: new MockEnumProperty(),
        items: new MockDataSet([]),
        MaxHeight: new MockWholeNumberProperty(),
        FontSize: new MockWholeNumberProperty(),
        ItemHeight: new MockWholeNumberProperty(),
    };
}
