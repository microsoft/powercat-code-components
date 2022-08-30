/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty } from './mock-context';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        Label: new MockStringProperty(),
        SpinnerSize: new MockEnumProperty(),
        LabelPosition: new MockEnumProperty(),
<<<<<<< HEAD
        SpinnerAlignment: new MockEnumProperty(),
        BackgroundColor: new MockStringProperty(),
=======
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
    };
}
