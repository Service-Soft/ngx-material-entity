/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DateUtilities } from '../../../../classes/date.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { ArrayTableComponent } from '../array-table.class';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'array-date-range-input',
    templateUrl: './array-date-range-input.component.html',
    styleUrls: ['./array-date-range-input.component.scss']
})
export class ArrayDateRangeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayTableComponent<DateRange, EntityType, DecoratorTypes.ARRAY_DATE_RANGE> implements OnInit {

    DateUtilities = DateUtilities;

    dateRangeStart?: Date;
    dateRangeEnd?: Date;

    override ngOnInit(): void {
        super.ngOnInit();
        this.input = {
            start: undefined as unknown as Date,
            end: undefined as unknown as Date,
            values: undefined
        };
    }

    /**
     * Adds a DateRange to the array.
     */
    addDateRange(): void {
        if (this.input && this.dateRangeStart && this.dateRangeEnd) {
            this.input.start = new Date(this.dateRangeStart);
            this.input.end = new Date(this.dateRangeEnd);
            const values: Date[] = DateUtilities.getDatesBetween(
                this.input.start,
                this.input.end,
                this.metadata.filter
            );
            this.input.values = values.length ? values : undefined;
            this.add();
        }
    }

    protected override resetInput(): void {
        this.input = undefined;
        this.dateRangeStart = undefined;
        this.dateRangeEnd = undefined;
    }
}