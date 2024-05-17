/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty, MockWholeNumberProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        Title: new MockStringProperty(),
        Sublabel: new MockStringProperty(),
        ChartValue: new MockWholeNumberProperty(),
        ChartValueFormat: new MockEnumProperty(),
        MinValue: new MockWholeNumberProperty(),
        MaxValue: new MockWholeNumberProperty(),
        HideLegend: new MockTwoOptionsProperty(),
        HideMinMax: new MockTwoOptionsProperty(),
        Theme: new MockStringProperty(),
        CustomColors: new MockTwoOptionsProperty(),
        items: new MockDataSet([]),
        TabIndex: new MockWholeNumberProperty(),
        Tooltip: new MockStringProperty(),
    };
}
