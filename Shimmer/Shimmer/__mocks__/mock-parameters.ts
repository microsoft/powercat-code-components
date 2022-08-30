/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockWholeNumberProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        RowCount: new MockWholeNumberProperty(),
        items: new MockDataSet([]),
        SpacebetweenShimmer: new MockEnumProperty(),
    };
}
