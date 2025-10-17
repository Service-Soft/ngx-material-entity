import { DateFilterFn } from '@angular/material/datepicker';

import { DropdownValue } from '../decorators/base/dropdown-value.interface';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { defaultTrue } from '../functions/default-true.function';

const DAY_IN_MS: number = 1000 * 60 * 60 * 24;

/**
 * Helper type for hours and minutes.
 */
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>;

/**
 * Helper type for hours and minutes.
 */
type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

/**
 * The possible hour values. Ranges from 0 to 23.
 */
export type Hour = Range<0, 24>;

/**
 * The possible minute values. Ranges from 0 to 59.
 */
export type Minute = Range<0, 60>;

/**
 * Represents a time value with hours and minutes.
 */
export type Time = {
    /**
     * The hours in the 24 hour format.
     */
    hours: Hour,
    /**
     * The minutes of the time.
     */
    minutes: Minute
};

/**
 * Valid steps from one time value to the next. Needs to be able to divide 60 minutes without remainder.
 */
type MinuteSteps = 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30 | 60;

/**
 * Contains Helper Functions for handling date properties.
 */
export abstract class DateUtilities {

    /**
     * The default filter function to user when none was provided by the user.
     */
    static defaultDateFilter: DateFilterFn<Date | null | undefined> = defaultTrue;

    /**
     * Gets the given value as a date value.
     * @param value - The value to get as a date.
     * @returns The given value as a date.
     */
    static asDate(value: unknown): Date {
        return value as Date;
    }

    /**
     * Gets the default times used by the DateTime picker when nothing is specified by the user.
     * @param format - The time format. Defaults to 24.
     * @param minuteSteps - The steps from one time value to the next. Defaults to 30.
     * @returns Times in the 24 hour format from 0:00 until 23:30 in 30 minute steps.
     */
    static getDefaultTimes(format: 12 | 24 = 24, minuteSteps: MinuteSteps = 30): DropdownValue<Time>[] {
        const res: DropdownValue<Time>[] = [{ displayName: '-', value: undefined as unknown as Time }];
        for (let hour: Hour = 0; hour < 24; hour++) {
            for (let minute: Minute = 0; minute < 60; minute += minuteSteps) {
                res.push(DateUtilities.getTimeDropdownValue(format, hour as Hour, minute as Minute));
            }
        }
        return res;
    }

    /**
     *
     * @param format
     * @param hour
     * @param minute
     */
    static getTimeDropdownValue(format: 12 | 24, hour: Hour, minute: Minute): DropdownValue<Time> {
        const displayHour: number = DateUtilities.getFormattedHour(format, LodashUtilities.cloneDeep(hour));
        const displayMinute: string = DateUtilities.getFormattedMinute(format, hour, minute);
        return {
            displayName: `${displayHour}:${displayMinute}`,
            value: {
                hours: hour,
                minutes: minute
            }
        };
    }

    private static getFormattedHour(format: 12 | 24, hour: number): number {
        if (format === 12 && hour > 12) {
            hour -= 12;
        }
        return hour;
    }

    private static getFormattedMinute(format: 12 | 24, hour: number, minute: number): string {
        let res: string = `${minute}`;
        if (format === 12) {
            res = hour > 12 ? `${minute} PM` : `${minute} AM`;
        }
        if (minute.toString().length === 1) {
            res = '0'.concat(res);
        }
        return res;
    }

    /**
     * Gets the Time object from the given date.
     * @param value - The date to get the time object from.
     * @returns The Time object build from the date value.
     */
    static getTimeFromDate(value?: Date): Time | undefined {
        if (!value) {
            return undefined;
        }
        return {
            hours: new Date(value).getHours() as Hour,
            minutes: new Date(value).getMinutes() as Minute
        };
    }

    /**
     * Gets the dates between the two given gates. Does additional filtering based on the provided DateRange metadata.
     * @param startDate - The start date.
     * @param endDate - The end date.
     * @param filter - The custom filter from the metadata.
     * @returns All dates between the two provided dates. Includes start and end date.
     */
    static getDatesBetween(startDate: Date, endDate: Date, filter?: DateFilterFn<Date>): Date[] {
        const clonedStartDate: Date = new Date(startDate);
        const res: Date[] = [];
        while (
            clonedStartDate.getFullYear() < endDate.getFullYear()
            || clonedStartDate.getMonth() < endDate.getMonth()
            || clonedStartDate.getDate() <= endDate.getDate()
        ) {
            res.push(new Date(clonedStartDate));
            clonedStartDate.setTime(clonedStartDate.getTime() + DAY_IN_MS);
        }
        return filter ? res.filter(d => filter(d)) : res;
    }

    /**
     * Get all valid times for the dropdown of a datetime property.
     * @param times - All given times to filter.
     * @param date - The date of the datetime.
     * @param min - The function that defines the minimum time.
     * @param max - The function that defines the maximum time.
     * @param filter - A filter function to do more specific time filtering. This could be e.g. The removal of lunch breaks.
     * @returns All valid dropdown values for the datetime property.
     */
    static getValidTimesForDropdown(
        times: DropdownValue<Time | undefined>[],
        date?: Date,
        min?: (date?: Date) => Time,
        max?: (date?: Date) => Time,
        filter?: ((time: Time) => boolean) | (() => boolean)
    ): DropdownValue<Time | undefined>[] {
        if (min) {
            const minTime: Time = min(date);
            times = times.filter(t => !t.value
                || t.value.hours > minTime.hours
                || (
                    t.value.hours === minTime.hours
                    && t.value.minutes >= minTime.minutes
                ));
        }
        if (max) {
            const maxTime: Time = max(date);
            times = times.filter(t => !t.value
                || t.value.hours < maxTime.hours
                || (
                    t.value.hours === maxTime.hours
                    && t.value.minutes <= maxTime.minutes
                ));
        }
        if (filter) {
            times = times.filter(t => !t.value || filter(t.value));
        }

        return times;
    }

    /**
     * Checks if the time object has processable hours and minutes properties.
     * Doesn't check custom validators like min/max from the metadata configuration.
     * @param time - The time to check.
     * @returns Whether or not the time object is unprocessable.
     */
    static timeIsUnprocessable(time?: Time): boolean {
        return time?.hours == undefined
            || typeof time.hours !== 'number'
            || Number.isNaN(time.hours)
            || time.minutes == undefined
            || typeof time.minutes !== 'number'
            || Number.isNaN(time.minutes);
    }
}