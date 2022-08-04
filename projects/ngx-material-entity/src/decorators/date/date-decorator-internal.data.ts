import { Time } from '@angular/common';
import { DateFilterFn } from '@angular/material/datepicker';
import { DateUtilities } from '../../classes/date.utilities';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { DateRangeDateDecoratorConfig, DateTimeDateDecoratorConfig, DefaultDateDecoratorConfig } from './date-decorator.data';

/**
 * The internal DefaultDateDecoratorConfig. Sets default values.
 */
export class DefaultDateDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DefaultDateDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'date';
    // eslint-disable-next-line jsdoc/require-jsdoc
    min?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    max?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    filter?: DateFilterFn<Date | null | undefined>;

    constructor(data: DefaultDateDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.max = data.max;
        this.min = data.min;
        this.filter = data.filter;
    }
}

/**
 * The internal DateRangeDateDecoratorConfig. Sets default values.
 */
export class DateRangeDateDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DateRangeDateDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'daterange';
    // eslint-disable-next-line jsdoc/require-jsdoc
    minStart?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxStart?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minEnd?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxEnd?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    filter?: DateFilterFn<Date>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    placeholderStart?: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    placeholderEnd?: string;

    constructor(data: DateRangeDateDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.minStart = data.minStart;
        this.maxStart = data.maxStart;
        this.minEnd = data.minEnd;
        this.maxEnd = data.maxEnd;
        this.filter = data.filter;
        this.placeholderStart = data.placeholderStart;
        this.placeholderEnd = data.placeholderEnd;
    }
}

/**
 * The internal DateTimeDateDecoratorConfig. Sets default values.
 */
export class DateTimeDateDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DateTimeDateDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'datetime';
    // eslint-disable-next-line jsdoc/require-jsdoc
    times: DropdownValue<Time>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    timeDisplayName: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minDate?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxDate?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    filterDate?: DateFilterFn<Date | null | undefined>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minTime?: (date?: Date) => Time;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxTime?: (date?: Date) => Time;
    // eslint-disable-next-line jsdoc/require-jsdoc
    filterTime?: ((time: Time) => boolean) | (() => boolean);

    constructor(data: DateTimeDateDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.times = data.times ? data.times : DateUtilities.getDefaultTimes();
        this.timeDisplayName = data.timeDisplayName ? data.timeDisplayName : 'Time';
        this.minDate = data.minDate;
        this.maxDate = data.maxDate;
        this.filterDate = data.filterDate;
        this.minTime = data.minTime;
        this.maxTime = data.maxTime;
        this.filterTime = data.filterTime;
    }
}