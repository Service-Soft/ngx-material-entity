/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTimeArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { NgModel } from '@angular/forms';
import { DateUtilities } from '../../../../classes/date.utilities';
import { ArrayTable } from '../array-table.class';
import { MatDialog } from '@angular/material/dialog';
import { Time } from '@angular/common';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'array-date-time-input',
    templateUrl: './array-date-time-input.component.html',
    styleUrls: ['./array-date-time-input.component.scss']
})
export class ArrayDateTimeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayTable<Date, EntityType> implements OnInit {

    DateUtilities = DateUtilities;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DateTimeArrayDecoratorConfigInternal;

    dateTime?: Date;
    time?: Time;
    timeDropdownValues!: DropdownValue<Time>[];

    constructor(private readonly dialog: MatDialog) {
        super(dialog);
    }

    ngOnInit(): void {
        this.init();
        this.time = DateUtilities.getTimeFromDate(this.entity[this.key] as Date);
        this.timeDropdownValues = this.metadata.times;
        if (this.entity[this.key] != null) {
            this.dateTime = new Date(this.entity[this.key] as Date);
        }
    }

    protected override resetInput(): void {
        this.input = undefined;
        this.time = undefined;
    }

    /**
     * Adds a date time to the array.
     */
    addDateTime(): void {
        if (this.input && this.time) {
            this.input = new Date(this.input);
            this.input.setHours(this.time.hours, this.time.minutes, 0, 0);
            this.add();
        }
    }

    protected emitChange(): void {
        this.inputChangeEvent.emit();
    }
}