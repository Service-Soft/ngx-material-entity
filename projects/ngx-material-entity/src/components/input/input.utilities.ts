import { Time } from '@angular/common';
import { DropdownValue } from '../../decorators/base/dropdown-value.interface';
import { PropertyDecoratorConfig } from '../../decorators/base/property-decorator.data';
import { DateRange, DefaultDateDecoratorConfig } from '../../decorators/date/date-decorator.data';

/**
 * Contains Helper Functions for the input component.
 */
export abstract class InputUtilities {
    // eslint-disable-next-line jsdoc/require-jsdoc
    static asDateMetadata(metadata: PropertyDecoratorConfig): DefaultDateDecoratorConfig {
        return metadata as DefaultDateDecoratorConfig;
    }

    /**
     * Gets the given value as a date value.
     *
     * @param value - The value to get as a date.
     * @returns The given value as a date.
     */
    static asDate(value: unknown): Date {
        return value as Date;
    }

    /**
     * Gets the given value as a date range value.
     *
     * @param value - The value to get as a date range.
     * @returns The given value as a date range.
     */
    static asDateRange(value: unknown): DateRange {
        return value as DateRange;
    }

    /**
     * Gets the Time object from the given date.
     *
     * @param value - The date to get the time object from.
     * @returns The Time object build from the date value.
     */
    static getTimeFromDate(value: Date): Time {
        if (!value) {
            return {
                hours: undefined,
                minutes: undefined
            } as unknown as Time;
        }
        else {
            return {
                hours: new Date(value).getHours(),
                minutes: new Date(value).getMinutes()
            };
        }
    }

    /**
     * Get all valid times for the dropdown of a datetime property.
     *
     * @param date - The date of the datetime.
     * @param times - All given times to filter.
     * @param min - The function that defines the minimum time.
     * @param max - The function that defines the maximum time.
     * @param filter - A filter function to do more specific time filtering. This could be e.g. The removal of lunch breaks.
     * @returns All valid dropdown values for the datetime property.
     */
    static getValidTimesForDropdown(
        date: Date,
        times: DropdownValue<Time>[],
        min?: (date?: Date) => Time,
        max?: (date?: Date) => Time,
        filter?: ((time: Time) => boolean) | (() => boolean)
    ): DropdownValue<Time>[] {
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
            times = times.filter(t => !t.value || filter(t.value))
        }

        return times;
    }
}