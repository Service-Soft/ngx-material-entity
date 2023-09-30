/* eslint-disable jsdoc/require-jsdoc */
import { Time } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { DateTimeDateDecoratorConfigInternal } from '../../../../decorators/date/date-decorator-internal.data';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../../../default-global-configuration-values';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { defaultTrue } from '../../../../functions/default-true.function';
import { NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { DateUtilities } from '../../../../utilities/date.utilities';
import { EntityUtilities } from '../../../../utilities/entity.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'date-time-input',
    templateUrl: './date-time-input.component.html',
    styleUrls: ['./date-time-input.component.scss']
})
export class DateTimeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.DATE_TIME, Date> implements OnInit {

    DateUtilities: typeof DateUtilities = DateUtilities;

    timeDropdownValues!: DropdownValue<Time | undefined>[];

    get time(): Time | undefined {
        return ReflectUtilities.getMetadata(EntityUtilities.TIME_KEY, this.entity, this.key) as Time | undefined;
    }

    set time(value: Time | undefined) {
        ReflectUtilities.defineMetadata(EntityUtilities.TIME_KEY, value, this.entity, this.key);
    }

    defaultDateFilter: DateFilterFn<Date | null | undefined> = defaultTrue;

    constructor(
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.metadata = new DateTimeDateDecoratorConfigInternal(this.metadata, this.globalConfig);
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
        this.propertyValue = new Date(this.propertyValue);
        if (this.time?.hours != null && this.time?.minutes != null) {
            this.propertyValue.setHours(this.time.hours, this.time.minutes, 0, 0);
        }
        else {
            this.propertyValue.setHours(0, 0, 0, 0);
        }
        this.emitChange();
    }
}