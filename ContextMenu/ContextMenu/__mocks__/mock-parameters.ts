/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty, MockWholeNumberProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        Theme: new MockStringProperty(),
        TextAlignment: new MockEnumProperty(),
        items: new MockDataSet([]),
        Chevron: new MockTwoOptionsProperty(),
        FillColor: new MockStringProperty(),
        BorderColor: new MockStringProperty(),
        BorderRadius: new MockWholeNumberProperty(),
        FontColor: new MockStringProperty(),
        FontSize: new MockWholeNumberProperty(),
        HoverBorderColor: new MockStringProperty(),
        HoverFillColor: new MockStringProperty(),
        HoverFontColor: new MockStringProperty(),
        HoverIconColor: new MockStringProperty(),
        IconColor: new MockStringProperty(),
        IconSize: new MockWholeNumberProperty(),
    };
}
