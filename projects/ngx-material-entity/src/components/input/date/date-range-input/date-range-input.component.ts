/* eslint-disable jsdoc/require-jsdoc */
import { Component, Input, OnInit } from '@angular/core';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DateRangeDateDecoratorConfigInternal } from '../../../../decorators/date/date-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgModel } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { LodashUtilities } from '../../../../capsulation/lodash.utilities';
import { DateUtilities } from '../../../../classes/date.utilities';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'date-range-input',
    templateUrl: './date-range-input.component.html',
    styleUrls: ['./date-range-input.component.scss']
})
export class DateRangeInputComponent<EntityType extends object> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    metadata!: DateRangeDateDecoratorConfigInternal;

    dateRange!: DateRange;
    dateRangeStart!: Date;
    dateRangeEnd!: Date;

    constructor() { }

    defaultDateFilter: DateFilterFn<Date | null | undefined> = (): boolean => true;

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.DATE_RANGE);

        this.dateRange = LodashUtilities.cloneDeep(this.entity[this.key] as unknown as DateRange);
        if (!this.dateRange) {
            this.dateRange = {
                start: undefined as unknown as Date,
                end: undefined as unknown as Date,
                values: undefined
            }
        }
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
                this.dateRange.start,
                this.dateRange.end,
                this.metadata.filter
            );
            this.dateRange.values = values.length ? values : undefined;
        }
        else {
            this.dateRange.values = undefined;
        }
        this.entity[this.key] = this.dateRange as unknown as EntityType[keyof EntityType]
    }
}