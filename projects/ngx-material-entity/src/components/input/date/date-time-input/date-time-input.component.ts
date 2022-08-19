/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DateTimeDateDecoratorConfigInternal } from '../../../../decorators/date/date-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgModel } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { Time } from '@angular/common';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { DateUtilities } from '../../../../classes/date.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'date-time-input',
    templateUrl: './date-time-input.component.html',
    styleUrls: ['./date-time-input.component.scss']
})
export class DateTimeInputComponent<EntityType extends BaseEntityType> implements OnInit {

    DateUtilities = DateUtilities;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DateTimeDateDecoratorConfigInternal;

    dateTime?: Date;
    time?: Time;
    timeDropdownValues!: DropdownValue<Time>[];

    constructor() { }

    defaultDateFilter: DateFilterFn<Date | null | undefined> = (): boolean => true;

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.DATE_TIME);
        this.time = DateUtilities.getTimeFromDate(this.entity[this.key] as unknown as Date);
        this.timeDropdownValues = this.metadata.times;
        if (this.entity[this.key] != null) {
            this.dateTime = new Date(this.entity[this.key] as unknown as Date);
        }
    }

    /**
     * Checks if two times are equal. Is needed for the dropdown.
     *
     * @param time1 - The first time to compare.
     * @param time2 - The second time to compare.
     * @returns Whether or not the time objects are the same.
     */
    compareTimes(time1: Time, time2: Time): boolean {
        return time1.hours === time2.hours && time1.minutes === time2.minutes;
    }

    /**
     * Sets the time on a datetime property.
     */
    setTime(): void {
        if (!this.dateTime) {
            this.entity[this.key] = undefined as unknown as EntityType[keyof EntityType];
            this.emitChange();
            return;
        }
        this.entity[this.key] = new Date(this.dateTime) as unknown as EntityType[keyof EntityType];
        if (this.time?.hours != null && this.time?.minutes != null) {
            (this.entity[this.key] as unknown as Date).setHours(this.time.hours, this.time.minutes, 0, 0);
        }
        else {
            (this.entity[this.key] as unknown as Date).setHours(0, 0, 0, 0);
        }
        this.emitChange();
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}