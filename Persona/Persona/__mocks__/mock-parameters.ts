/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty } from './mock-context';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        Theme: new MockStringProperty(),
        PersonaSize: new MockEnumProperty(),
        ImageUrl: new MockStringProperty(),
        ImageAlt: new MockStringProperty(),
        Presence: new MockEnumProperty(),
        ImageInitials: new MockStringProperty(),
        OptionalText: new MockStringProperty(),
        HidePersonaDetails: new MockTwoOptionsProperty(),
        TertiaryText: new MockStringProperty(),
        Text: new MockStringProperty(),
        SecondaryText: new MockStringProperty(),
        PersonaInitialsColor: new MockEnumProperty(),
    };
}
