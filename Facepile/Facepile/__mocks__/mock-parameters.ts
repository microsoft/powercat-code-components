/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty, MockWholeNumberProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        Theme: new MockStringProperty(),
        items: new MockDataSet([]),
        MaxDisplayablePersonas: new MockWholeNumberProperty(),
        ImageShouldFadeIn: new MockTwoOptionsProperty(),
        PersonaSize: new MockEnumProperty(),
        OverflowButtonType: new MockEnumProperty(),
        ShowAddButton: new MockTwoOptionsProperty(),
        OverflowButtonAriaLabel: new MockStringProperty(),
        AddbuttonAriaLabel: new MockStringProperty(),
    };
}
