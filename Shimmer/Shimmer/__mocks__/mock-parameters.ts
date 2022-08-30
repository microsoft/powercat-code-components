/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
<<<<<<< HEAD
import { MockEnumProperty, MockStringProperty, MockWholeNumberProperty } from './mock-context';
=======
import { MockEnumProperty, MockStringProperty } from './mock-context';
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
<<<<<<< HEAD
        RowCount: new MockWholeNumberProperty(),
        items: new MockDataSet([]),
=======
        items: new MockDataSet([]),
        rows: new MockDataSet([]),
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
        SpacebetweenShimmer: new MockEnumProperty(),
    };
}
