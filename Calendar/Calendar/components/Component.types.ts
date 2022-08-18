export interface ICalendarProps {
    width?: number;
    height?: number;
    themeJSON?: string;
    setFocus?: string;
    tabIndex?: number;
    selectedDateValue: Date | undefined;
    minDate: Date | undefined;
    maxDate: Date | undefined;
    ariaLabel: string;
    showGoToToday?: boolean;
    monthPickerVisible?: boolean;
    dayPickerVisible?: boolean;
    highlightSelectedMonth?: boolean;
    highlightCurrentMonth?: boolean;
    showSixWeeksByDefault?: boolean;
    showWeekNumbers: boolean;
    firstDayOfWeek: string;
    isDisabled: boolean;
    // eslint-disable-next-line
    onSelected: (selectedDateValue: Date) => void;
    backgroundColor?: string;
}
