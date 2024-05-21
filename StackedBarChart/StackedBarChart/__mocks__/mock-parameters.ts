/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockStringProperty, MockTwoOptionsProperty, MockWholeNumberProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        Title: new MockStringProperty(),
        HideTooltip: new MockTwoOptionsProperty(),
        BarHeight: new MockWholeNumberProperty(),
        HideLegend: new MockTwoOptionsProperty(),
        BarBackgroundColor: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        Theme: new MockStringProperty(),
        CustomColors: new MockTwoOptionsProperty(),
        items: new MockDataSet([]),
        TabIndex: new MockWholeNumberProperty(),
        Tooltip: new MockStringProperty(),
    };
}
