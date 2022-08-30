/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockWholeNumberProperty, MockDecimalNumberProperty, MockTwoOptionsProperty } from './mock-context';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        Label: new MockStringProperty(),
        Description: new MockStringProperty(),
        TypeofIndicator: new MockEnumProperty(),
<<<<<<< HEAD
        PercentComplete: new MockWholeNumberProperty(),
=======
        PercentComplete: new MockDecimalNumberProperty(),
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
        HideProgressBar: new MockTwoOptionsProperty(),
        BarHeight: new MockWholeNumberProperty()
    };
}
