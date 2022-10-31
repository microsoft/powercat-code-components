/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockEnumProperty, MockStringProperty, MockTwoOptionsProperty, MockWholeNumberProperty } from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        Personas: new MockDataSet([]),
        Suggestions: new MockDataSet([]),
        Error: new MockTwoOptionsProperty(),
        ShowSecondaryText: new MockTwoOptionsProperty(),
        PeoplePickerType: new MockEnumProperty(),
        MinimumSearchTermLength: new MockWholeNumberProperty(),
        SearchTermToShortMessage: new MockStringProperty(),
        SuggestionsHeaderText: new MockStringProperty(),
        NoResultFoundMesage: new MockStringProperty(),
        HintText: new MockStringProperty(),
        MaxPeople: new MockWholeNumberProperty(),
    };
}
