/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { DateUtilities } from '../../../../classes/date.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

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
export class DateRangeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.DATE_RANGE, DateRange> implements OnInit {

    dateRange!: DateRange;
    dateRangeStart?: Date;
    dateRangeEnd?: Date;

    defaultDateFilter = DateUtilities.defaultDateFilter;

    override ngOnInit(): void {
        super.ngOnInit();
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
            this.dateRange.values = values.length ? values : undefined;
        }
        else {
            this.dateRange.values = undefined;
        }
        this.propertyValue = this.dateRange;
        this.emitChange();
    }
}