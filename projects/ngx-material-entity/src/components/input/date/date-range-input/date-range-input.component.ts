/* eslint-disable jsdoc/require-jsdoc */
import { Component, Inject, OnInit } from '@angular/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DateRangeDateDecoratorConfigInternal } from '../../../../decorators/date/date-decorator-internal.data';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../../../default-global-configuration-values';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { DateUtilities } from '../../../../utilities/date.utilities';
import { EntityUtilities } from '../../../../utilities/entity.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

const EMPTY_DATERANGE: DateRange = {
    start: undefined as unknown as Date,
    end: undefined as unknown as Date,
    values: undefined as unknown as Date[]
};

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'date-range-input',
    templateUrl: './date-range-input.component.html',
    styleUrls: ['./date-range-input.component.scss']
})
export class DateRangeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.DATE_RANGE, DateRange> implements OnInit {

    get dateRange(): DateRange {
        return ReflectUtilities.getMetadata(EntityUtilities.DATE_RANGE_KEY, this.entity, this.key) as DateRange;
    }
    set dateRange(value: DateRange) {
        ReflectUtilities.defineMetadata(EntityUtilities.DATE_RANGE_KEY, value, this.entity, this.key);
    }

    get dateRangeStart(): Date | undefined {
        return ReflectUtilities.getMetadata(EntityUtilities.DATE_RANGE_START_KEY, this.entity, this.key) as Date | undefined;
    }
    set dateRangeStart(value: Date | undefined) {
        ReflectUtilities.defineMetadata(EntityUtilities.DATE_RANGE_START_KEY, value, this.entity, this.key);
    }

    get dateRangeEnd(): Date | undefined {
        return ReflectUtilities.getMetadata(EntityUtilities.DATE_RANGE_END_KEY, this.entity, this.key) as Date | undefined;
    }
    set dateRangeEnd(value: Date | undefined) {
        ReflectUtilities.defineMetadata(EntityUtilities.DATE_RANGE_END_KEY, value, this.entity, this.key);
    }

    defaultDateFilter: DateFilterFn<Date | null | undefined> = DateUtilities.defaultDateFilter;

    constructor(
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.metadata = new DateRangeDateDecoratorConfigInternal(this.metadata, this.globalConfig);
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.key);
        this.dateRange = LodashUtilities.cloneDeep(this.propertyValue) ?? EMPTY_DATERANGE;
        this.dateRangeStart = new Date(this.dateRange.start);
        this.dateRangeEnd = new Date(this.dateRange.end);
        this.setDateRangeValues();
    }

    /**
     * Updates the date range values based on the start and end date.
     */
    setDateRangeValues(): void {
        if (this.dateRangeStart && this.dateRangeEnd) {
            this.dateRange.start = new Date(this.dateRangeStart);
            this.dateRange.end = new Date(this.dateRangeEnd);
            const values: Date[] = DateUtilities.getDatesBetween(
                new Date(this.dateRange.start),
                new Date(this.dateRange.end),
                this.metadata.filter
            );
            this.dateRange.values = values.length ? values : undefined as unknown as Date[];
        }
        else {
            this.dateRange.start = undefined as unknown as Date;
            this.dateRange.end = undefined as unknown as Date;
            this.dateRange.values = undefined as unknown as Date[];
        }
        this.propertyValue = this.dateRange;
        this.emitChange();
    }
}