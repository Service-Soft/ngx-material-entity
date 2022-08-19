/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DateRangeDateDecoratorConfigInternal } from '../../../../decorators/date/date-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgModel } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { LodashUtilities } from '../../../../capsulation/lodash.utilities';
import { DateUtilities } from '../../../../classes/date.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';

const EMPTY_DATERANGE: DateRange = {
    start: undefined as unknown as Date,
    end: undefined as unknown as Date,
    values: undefined
};

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'date-range-input',
    templateUrl: './date-range-input.component.html',
    styleUrls: ['./date-range-input.component.scss']
})
export class DateRangeInputComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DateRangeDateDecoratorConfigInternal;

    dateRange!: DateRange;
    dateRangeStart?: Date;
    dateRangeEnd?: Date;

    constructor() { }

    defaultDateFilter: DateFilterFn<Date | null | undefined> = (): boolean => true;

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.DATE_RANGE);

        this.dateRange = LodashUtilities.cloneDeep(this.entity[this.key] as DateRange) ?? EMPTY_DATERANGE;
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
            this.dateRange.values = values.length ? values : undefined;
        }
        else {
            this.dateRange.values = undefined;
        }
        (this.entity[this.key] as DateRange) = this.dateRange;
        this.emitChange();
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}