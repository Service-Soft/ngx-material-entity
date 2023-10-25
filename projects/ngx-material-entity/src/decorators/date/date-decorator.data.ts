import { Time } from '@angular/common';
import { DateFilterFn } from '@angular/material/datepicker';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * This is the needed type for an property that should be displayed as a date range.
 */
export interface DateRange {
    /**
     * The start date of the range.
     */
    start: Date,
    /**
     * The end date of the range.
     */
    end: Date,
    /**
     * The actual Date values. These are needed if the date range might contain some values that are disabled.
     * E.g. When you build a tool to request vacation you may want the user to select 3 weeks in the range picker
     * but don't want the weekend dates in the final result.
     */
    values: Date[]
}

/**
 * Definition for the @date metadata.
 */
abstract class DateDecoratorConfig<ValueType> extends PropertyDecoratorConfig<ValueType> {
    /**
     * How to display the date.
     */
    displayStyle!: 'date' | 'datetime' | 'daterange';
}

/**
 * The configuration options for a date property displayed as a default single date picker.
 */
export interface DefaultDateDecoratorConfig extends DateDecoratorConfig<Date> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'date',
    /**
     * A function to get the minimum value of the date.
     */
    min?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the date.
     */
    max?: (date?: Date) => Date,
    /**
     * A filter function to do more specific filtering. This could be the removal of e.g. All weekends.
     */
    filter?: DateFilterFn<Date | null | undefined>
}

/**
 * The configuration options for a date property displayed as a date range.
 */
export interface DateRangeDateDecoratorConfig extends DateDecoratorConfig<DateRange> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'daterange',
    /**
     * A function to get the minimum value of the start date.
     */
    minStart?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the start date.
     */
    maxStart?: (date?: Date) => Date,
    /**
     * A function to get the minimum value of the end date.
     */
    minEnd?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the end date.
     */
    maxEnd?: (date?: Date) => Date,
    /**
     * A filter function to do more specific filtering on the disallowed end date values. This could be the removal of e.g. All weekends.
     */
    filter?: DateFilterFn<Date>,
    /**
     * The placeholder for the start date of the date range picker.
     * @default "Start"
     */
    placeholderStart?: string,
    /**
     * The placeholder for the end date of the date range picker.
     * @default "End"
     */
    placeholderEnd?: string
}

/**
 * The configuration options for a date property displayed as date time.
 */
export interface DateTimeDateDecoratorConfig extends DateDecoratorConfig<Date> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'datetime',
    /**
     * The selectable times.
     */
    times?: DropdownValue<Time | undefined>[],
    /**
     * The name to use as a label for the time form field.
     * @default 'Time'
     */
    timeDisplayName?: string,
    /**
     * A function to get the minimum value of the date.
     */
    minDate?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the date.
     */
    maxDate?: (date?: Date) => Date,
    /**
     * A filter function to do more specific date filtering. This could be the removal of e.g. All weekends.
     */
    filterDate?: DateFilterFn<Date | null | undefined>,
    /**
     * A function to get the minimum value of the time.
     */
    minTime?: (date?: Date) => Time,
    /**
     * A function to get the maximum value of the time.
     */
    maxTime?: (date?: Date) => Time,
    /**
     * A filter function to do more specific time filtering. This could be e.g. The removal of lunch breaks.
     */
    filterTime?: ((time: Time) => boolean) | (() => boolean)
}