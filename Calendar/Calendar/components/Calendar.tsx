import * as React from 'react';
<<<<<<< HEAD
import {
    ThemeProvider,
    createTheme,
    IPartialTheme,
    ICalendar,
    ICalendarStrings,
    defaultCalendarStrings,
} from '@fluentui/react';
=======
import { ThemeProvider, createTheme, IPartialTheme, defaultCalendarStrings, ICalendar } from '@fluentui/react';
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
import { Calendar as CustomCalendar } from '../fluentui-fork/Calendar/Calendar';
import { ICalendarProps } from './Component.types';
import { getWeeksFirstDay } from '../components/Utilities';
import { useAsync } from '@fluentui/react-hooks';
<<<<<<< HEAD
import { DateTimePickerStrings } from './DateTimePickerStrings';
=======
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5

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
<<<<<<< HEAD
        language,
    } = props;
    const [calendarString, setCalendarSting] = React.useState<ICalendarStrings>();
=======
    } = props;
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const componentRef = React.useRef<ICalendar>(null);
    const async = useAsync();
    React.useEffect(() => {
        if (setFocus && setFocus !== '' && componentRef) {
            async.requestAnimationFrame(() => {
                (componentRef as React.RefObject<ICalendar>).current?.focus();
            });
        }
    }, [setFocus, componentRef, async]);

    function onSelectDate(date: Date) {
        onSelected(date);
    }

    React.useEffect(() => {
        if (selectedDateValue) onSelected(selectedDateValue);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

<<<<<<< HEAD
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

=======
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
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
<<<<<<< HEAD
                strings={calendarString}
=======
                strings={defaultCalendarStrings}
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
                tabIndex={isDisabled ? -1 : tabIndex}
                isMonthPickerVisible={monthPickerVisible}
                isDayPickerVisible={dayPickerVisible}
                showWeekNumbers={showWeekNumbers}
                showSixWeeksByDefault={showSixWeeksByDefault}
                highlightCurrentMonth={highlightCurrentMonth}
                minDate={minDate}
                maxDate={maxDate}
                styles={{ root: { background: backgroundColor } }} // To remove transparency
            />
        </ThemeProvider>
    );
});
CanvasCalendar.displayName = 'CanvasCalendar';
