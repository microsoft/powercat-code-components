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
<<<<<<< HEAD
    language: string;
=======
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
    // eslint-disable-next-line
    onSelected: (selectedDateValue: Date) => void;
    backgroundColor?: string;
}
