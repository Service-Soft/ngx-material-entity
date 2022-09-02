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
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.DATE_TIME, Date> implements OnInit {

    DateUtilities = DateUtilities;

    time?: Time;
    timeDropdownValues!: DropdownValue<Time>[];

    defaultDateFilter: DateFilterFn<Date | null | undefined> = (): boolean => true;

    override ngOnInit(): void {
        super.ngOnInit();
        this.time = DateUtilities.getTimeFromDate(this.propertyValue);
        this.timeDropdownValues = this.metadata.times;
        if (this.propertyValue) {
            this.propertyValue = new Date(this.propertyValue);
        }
    }

    /**
     * Checks if two times are equal. Is needed for the dropdown.
     *
     * @param time1 - The first time to compare.
     * @param time2 - The second time to compare.
     * @returns Whether or not the time objects are the same.
     */
    compareTimes(time1?: Time, time2?: Time): boolean {
        if (time1 && time2 && time1.hours === time2.hours && time1.minutes === time2.minutes) {
            return true;
        }
        return false;
    }

    /**
     * Sets the time on a datetime property.
     */
    setTime(): void {
        if (!this.propertyValue) {
            this.emitChange();
            return;
        }
        if (this.time?.hours != null && this.time?.minutes != null) {
            this.propertyValue.setHours(this.time.hours, this.time.minutes, 0, 0);
        }
        else {
            this.propertyValue.setHours(0, 0, 0, 0);
        }
        this.emitChange();
    }
}