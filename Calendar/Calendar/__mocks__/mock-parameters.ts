/* istanbul ignore file */

import { IInputs } from '../generated/ManifestTypes';
import { MockDateTimeProperty, MockEnumProperty, MockStringProperty, MockTwoOptionsProperty } from './mock-context';

export function getMockParameters(): IInputs {
    return {
        AccessibilityLabel: new MockStringProperty(),
        InputEvent: new MockStringProperty(),
        Theme: new MockStringProperty(),
        SelectedDateValue: new MockDateTimeProperty(),
        MinDate: new MockDateTimeProperty(),
        MaxDate: new MockDateTimeProperty(),
        ShowGoToToday: new MockTwoOptionsProperty(),
        MonthPickerVisible: new MockTwoOptionsProperty(),
        DayPickerVisible: new MockTwoOptionsProperty(),
        HighlightSelectedMonth: new MockTwoOptionsProperty(),
        HighlightCurrentMonth: new MockTwoOptionsProperty(),
        ShowSixWeeksByDefault: new MockTwoOptionsProperty(),
        ShowWeekNumbers: new MockTwoOptionsProperty(),
        FirstDayOfWeek: new MockEnumProperty(),
        BackgroundColor: new MockStringProperty(),
        Language: new MockStringProperty(),
    };
}
