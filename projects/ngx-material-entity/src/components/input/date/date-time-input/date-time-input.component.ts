/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DateFilterFn } from '@angular/material/datepicker';
import { Time } from '@angular/common';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { DateUtilities } from '../../../../classes/date.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'date-time-input',
    templateUrl: './date-time-input.component.html',
    styleUrls: ['./date-time-input.component.scss']
})
export class DateTimeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.DATE_TIME> implements OnInit {

    DateUtilities = DateUtilities;

    dateTime?: Date;
    time?: Time;
    timeDropdownValues!: DropdownValue<Time>[];

    defaultDateFilter: DateFilterFn<Date | null | undefined> = (): boolean => true;

    override ngOnInit(): void {
        super.ngOnInit();
        this.time = DateUtilities.getTimeFromDate(this.entity[this.key] as Date);
        this.timeDropdownValues = this.metadata.times;
        if (this.entity[this.key] != null) {
            this.dateTime = new Date(this.entity[this.key] as Date);
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
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        return time1 && time2 && time1.hours === time2.hours && time1.minutes === time2.minutes;
    }

    /**
     * Sets the time on a datetime property.
     */
    setTime(): void {
        if (!this.dateTime) {
            (this.entity[this.key] as undefined) = undefined;
            this.emitChange();
            return;
        }
        (this.entity[this.key] as Date) = new Date(this.dateTime);
        if (this.time?.hours != null && this.time?.minutes != null) {
            (this.entity[this.key] as Date).setHours(this.time.hours, this.time.minutes, 0, 0);
        }
        else {
            (this.entity[this.key] as Date).setHours(0, 0, 0, 0);
        }
        this.emitChange();
    }
}