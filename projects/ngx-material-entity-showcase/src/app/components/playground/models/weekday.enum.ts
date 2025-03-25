/**
 * The names of the days of the week.
 */
export enum Weekday {
    MONDAY = 'Montag',
    TUESDAY = 'Dienstag',
    WEDNESDAY = 'Mittwoch',
    THURSDAY = 'Donnerstag',
    FRIDAY = 'Freitag',
    SATURDAY = 'Samstag',
    SUNDAY = 'Sonntag'
}

/**
 * The number of weekdays based on the date objects weekday number.
 * Starts at 0 (Sunday).
 */
export type WeekdayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * The weekday name for a given weekday number,.
 */
export const weekdayForNumber: Record<WeekdayNumber, Weekday> = {
    1: Weekday.MONDAY,
    2: Weekday.TUESDAY,
    3: Weekday.WEDNESDAY,
    4: Weekday.THURSDAY,
    5: Weekday.FRIDAY,
    6: Weekday.SATURDAY,
    0: Weekday.SUNDAY
};