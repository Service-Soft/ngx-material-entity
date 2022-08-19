/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DateUtilities } from '../../../../classes/date.utilities';
import { DateRangeArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { ArrayTable } from '../array-table.class';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'array-date-range-input',
    templateUrl: './array-date-range-input.component.html',
    styleUrls: ['./array-date-range-input.component.scss']
})
export class ArrayDateRangeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayTable<DateRange, EntityType> implements OnInit {

    DateUtilities = DateUtilities;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    metadata!: DateRangeArrayDecoratorConfigInternal;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    dateRangeStart?: Date;
    dateRangeEnd?: Date;

    constructor(private readonly dialog: MatDialog) {
        super(dialog);
    }

    ngOnInit(): void {
        this.init();
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

    protected emitChange(): void {
        this.inputChangeEvent.emit();
    }
}