/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockStringProperty, MockTwoOptionsProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        CollapseByDefault: new MockTwoOptionsProperty(),
        InputEvent: new MockStringProperty(),
        SelectedKey: new MockStringProperty(),
        Theme: new MockStringProperty(),
        items: new MockDataSet([]),
    };
}
