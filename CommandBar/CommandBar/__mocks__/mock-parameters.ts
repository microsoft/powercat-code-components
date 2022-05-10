/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockStringProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        items: new MockDataSet([]),
    };
}
