/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import {
    MockDecimalProperty,
    MockStringProperty,
    MockTwoOptionsProperty,
    MockWholeNumberProperty,
} from './mock-context';
import { MockDataSet } from './mock-datasets';

export function getMockParameters(): IInputs {
    return {
        Theme: new MockStringProperty(),
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        Tags: new MockDataSet([]),
        Suggestions: new MockDataSet([]),
        BorderRadius: new MockWholeNumberProperty(),
        Error: new MockTwoOptionsProperty(),
        FontSize: new MockWholeNumberProperty(),
        HintText: new MockStringProperty(),
        AllowFreeText: new MockTwoOptionsProperty(),
        ItemHeight: new MockWholeNumberProperty(),
        MaxTags: new MockWholeNumberProperty(),
        MinimumSearchTermLength: new MockWholeNumberProperty(),
        NoSuggestionFoundMessage: new MockStringProperty(),
        SearchTermToShortMessage: new MockStringProperty(),
        TagMaxWidth: new MockDecimalProperty(),
    };
}
