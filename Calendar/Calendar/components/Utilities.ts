import { DayOfWeek } from '@fluentui/react';

export function getWeeksFirstDay(daySelected: string): DayOfWeek {
    let selectedDay: DayOfWeek = DayOfWeek.Sunday;
    switch (daySelected.toLowerCase()) {
        case 'monday':
            selectedDay = DayOfWeek.Monday;
            break;
        case 'tuesday':
            selectedDay = DayOfWeek.Tuesday;
            break;
        case 'wednesday':
            selectedDay = DayOfWeek.Wednesday;
            break;
        case 'thursday':
            selectedDay = DayOfWeek.Thursday;
            break;
        case 'friday':
            selectedDay = DayOfWeek.Friday;
            break;
        case 'saturday':
            selectedDay = DayOfWeek.Saturday;
            break;
        case 'sunday':
            selectedDay = DayOfWeek.Sunday;
            break;
        default:
            selectedDay;
    }
    return selectedDay;
}
