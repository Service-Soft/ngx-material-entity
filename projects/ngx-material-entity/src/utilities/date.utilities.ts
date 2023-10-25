import { Time } from '@angular/common';
import { DateFilterFn } from '@angular/material/datepicker';
import { DropdownValue } from '../decorators/base/dropdown-value.interface';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { defaultTrue } from '../functions/default-true.function';

// eslint-disable-next-line constCase/uppercase
const DAY_IN_MS: number = 1000 * 60 * 60 * 24;

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
        for (let hour: number = 0; hour < 24; hour++) {
            for (let minute: number = 0; minute < 60; minute += minuteSteps) {
                res.push(DateUtilities.getTimeDropdownValue(format, hour, minute));
            }
        }
        return res;
    }

    private static getTimeDropdownValue(format: 12 | 24, hour: number, minute: number): DropdownValue<Time> {
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
            if (hour > 12) {
                res = `${minute} PM`;
            }
            else {
                res = `${minute} AM`;
            }
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
        else {
            return {
                hours: new Date(value).getHours(),
                minutes: new Date(value).getMinutes()
            };
        }
    }

    /**
     * Gets the dates between the two given gates. Does additional filtering based on the provided DateRange metadata.
     * @param startDate - The start date.
     * @param endDate - The end date.
     * @param filter - The custom filter from the metadata.
     * @returns All dates between the two provided dates. Includes start and end date.
     */
    static getDatesBetween(
        startDate: Date,
        endDate: Date,
        filter?: DateFilterFn<Date>
    ): Date[] {
        const res: Date[] = [];
        while (
            startDate.getFullYear() < endDate.getFullYear()
            || startDate.getMonth() < endDate.getMonth()
            || startDate.getDate() <= endDate.getDate()
        ) {
            res.push(new Date(startDate));
            startDate.setTime(startDate.getTime() + DAY_IN_MS);
        }
        if (filter) {
            return res.filter(d => filter(d));
        }
        else {
            return res;
        }
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
            times = times.filter(t =>
                !t.value
                || t.value.hours > minTime.hours
                || (
                    t.value.hours === minTime.hours
                    && t.value.minutes >= minTime.minutes
                )
            );
        }
        if (max) {
            const maxTime: Time = max(date);
            times = times.filter(t =>
                !t.value
                || t.value.hours < maxTime.hours
                || (
                    t.value.hours === maxTime.hours
                    && t.value.minutes <= maxTime.minutes
                )
            );
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
        if (
            time?.hours == null
            || typeof time.hours !== 'number'
            || Number.isNaN(time.hours)
            || time.minutes == null
            || typeof time.minutes !== 'number'
            || Number.isNaN(time.minutes)
        ) {
            return true;
        }
        return false;
    }
}