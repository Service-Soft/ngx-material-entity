/**
 * Enum of all possible months based on the Date object.
 * Starts at 0 (JANUARY).
 */
export enum Month {
    JANUARY = 0,
    FEBRUARY = 1,
    MARCH = 2,
    APRIL = 3,
    MAY = 4,
    JUNE = 5,
    JULY = 6,
    AUGUST = 7,
    SEPTEMBER = 8,
    OCTOBER = 9,
    NOVEMBER = 10,
    DECEMBER = 11
}

/**
 * Nam for a given month.
 */
export const monthNames: Record<Month, string> = {
    [Month.JANUARY]: 'Januar',
    [Month.FEBRUARY]: 'Februar',
    [Month.MARCH]: 'März',
    [Month.APRIL]: 'April',
    [Month.MAY]: 'Mai',
    [Month.JUNE]: 'Juni',
    [Month.JULY]: 'Juli',
    [Month.AUGUST]: 'August',
    [Month.SEPTEMBER]: 'September',
    [Month.OCTOBER]: 'Oktober',
    [Month.NOVEMBER]: 'November',
    [Month.DECEMBER]: 'Dezember'
};