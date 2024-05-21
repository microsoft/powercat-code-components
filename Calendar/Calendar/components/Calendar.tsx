import * as React from 'react';
import { ThemeProvider, createTheme, IPartialTheme, ICalendarStrings, defaultCalendarStrings } from '@fluentui/react';
import { Calendar as CustomCalendar } from '../fluentui-fork/Calendar/Calendar';
import { ICalendarProps } from './Component.types';
import { getWeeksFirstDay } from '../components/Utilities';
import { DateTimePickerStrings } from './DateTimePickerStrings';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const CanvasCalendar = React.memo((props: ICalendarProps) => {
    const {
        themeJSON,
        selectedDateValue,
        ariaLabel,
        monthPickerVisible,
        dayPickerVisible,
        firstDayOfWeek,
        setFocus,
        onSelected,
        showGoToToday,
        highlightSelectedMonth,
        highlightCurrentMonth,
        showSixWeeksByDefault,
        showWeekNumbers,
        minDate,
        maxDate,
        tabIndex,
        isDisabled,
        backgroundColor,
        language,
    } = props;
    const componentRef = React.useRef<HTMLDivElement>(null);
    const [calendarString, setCalendarSting] = React.useState<ICalendarStrings>();
    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    React.useEffect(() => {
        if (setFocus && setFocus !== '' && componentRef) {
            const selectedDayBtn = (componentRef.current as HTMLElement).getElementsByClassName(
                'ms-CalendarDay-daySelected',
            );
            if (!isDisabled && selectedDayBtn && selectedDayBtn.length > 0) {
                (selectedDayBtn[0] as HTMLInputElement).focus();
            }
        }
    }, [setFocus, componentRef, isDisabled]);

    function onSelectDate(date: Date) {
        onSelected(date);
    }

    React.useEffect(() => {
        async function getCalendarStrings() {
            setCalendarSting((await DateTimePickerStrings(language)) as ICalendarStrings);
        }
        if (language?.substring(0, 2) !== 'en') {
            getCalendarStrings();
        } else {
            setCalendarSting(defaultCalendarStrings);
        }
    }, [language]);

    return (
        // Issue : Calendar Control does not have a Disabled prop yet - https://github.com/microsoft/fluentui/issues/19453,
        // Hence custom styling with negative tabIndex are included to support disabling
        <ThemeProvider className={isDisabled ? 'PowerCATCalendarDisable' : undefined} applyTo="none" theme={theme}>
            <CustomCalendar
                showGoToToday={showGoToToday}
                firstDayOfWeek={getWeeksFirstDay(firstDayOfWeek)}
                highlightSelectedMonth={highlightSelectedMonth}
                onSelectDate={onSelectDate}
                value={selectedDateValue}
                aria-label={ariaLabel}
                strings={calendarString}
                tabIndex={isDisabled ? -1 : tabIndex}
                isMonthPickerVisible={monthPickerVisible}
                isDayPickerVisible={dayPickerVisible}
                showWeekNumbers={showWeekNumbers}
                showSixWeeksByDefault={showSixWeeksByDefault}
                highlightCurrentMonth={highlightCurrentMonth}
                minDate={minDate}
                maxDate={maxDate}
                ref={componentRef}
                styles={{ root: { background: backgroundColor } }} // To remove transparency
            />
        </ThemeProvider>
    );
});
CanvasCalendar.displayName = 'CanvasCalendar';
