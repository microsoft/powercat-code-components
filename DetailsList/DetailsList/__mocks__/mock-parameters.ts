/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty, MockWholeNumberProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        Theme: new MockStringProperty(),
        Compact: new MockTwoOptionsProperty(),
        CurrentSortColumn: new MockStringProperty(),
        CurrentSortDirection: new MockEnumProperty('0'),
        PageSize: new MockWholeNumberProperty(),
        RaiseOnRowSelectionChangeEvent: new MockTwoOptionsProperty(),
        SelectRowsOnFocus: new MockTwoOptionsProperty(),
        SelectionType: new MockEnumProperty('0'),
        AlternateRowColor: new MockStringProperty(),
        HeaderVisible: new MockTwoOptionsProperty(false),
        SelectionAlwaysVisible: new MockTwoOptionsProperty(false),
        records: new MockDataSet([]),
        columns: new MockDataSet([]),
        LargeDatasetPaging: new MockTwoOptionsProperty(),
    };
}
